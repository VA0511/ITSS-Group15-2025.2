package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/infra/api/dto"
)

type memberRepository struct {
	db *sql.DB
}

func NewMemberRepository(db *sql.DB) adapter.MemberRepository {
	return &memberRepository{db: db}
}

func (r *memberRepository) Create(member *entity.Member) error {
	var accountID interface{} = member.AccountID
	if member.AccountID == 0 {
		accountID = nil
	}
	query := `INSERT INTO "Member" (full_name, phone, email, gender, dob, address, account_id, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	return r.db.QueryRow(query, member.FullName, member.Phone, member.Email, member.Gender, member.DOB, member.Address, accountID, member.IsActive).Scan(&member.ID)
}

func (r *memberRepository) GetByID(id int) (*entity.Member, error) {
	member := &entity.Member{}
	query := `SELECT m.id, COALESCE(m.full_name, ''), COALESCE(m.phone, ''), COALESCE(m.email, ''), COALESCE(m.gender, ''), COALESCE(m.dob, CURRENT_DATE), COALESCE(m.address, ''), COALESCE(m.roadmap_goal, ''), COALESCE(m.member_free_schedule, ''), COALESCE(m.account_id, 0), COALESCE(m.is_active, true), COALESCE(p.package_name, ''), COALESCE(s.registration_date, CURRENT_DATE)
	FROM "Member" m
	LEFT JOIN (
		SELECT DISTINCT ON (member_id) member_id, package_id, registration_date
		FROM "Subscription"
		ORDER BY member_id, id DESC
	) s ON m.id = s.member_id
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id
	WHERE m.id = $1`
	err := r.db.QueryRow(query, id).Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.RoadmapGoal, &member.MemberFreeSchedule, &member.AccountID, &member.IsActive, &member.PackageName, &member.RegisteredAt)
	return member, err
}

func (r *memberRepository) GetAll() ([]*entity.Member, error) {
	query := `SELECT m.id, COALESCE(m.full_name, ''), COALESCE(m.phone, ''), COALESCE(m.email, ''), COALESCE(m.gender, ''), COALESCE(m.dob, CURRENT_DATE), COALESCE(m.address, ''), COALESCE(m.roadmap_goal, ''), COALESCE(m.member_free_schedule, ''), COALESCE(m.account_id, 0), COALESCE(m.is_active, true), COALESCE(p.package_name, ''), COALESCE(s.registration_date, CURRENT_DATE)
	FROM "Member" m
	LEFT JOIN (
		SELECT DISTINCT ON (member_id) member_id, package_id, registration_date
		FROM "Subscription"
		ORDER BY member_id, id DESC
	) s ON m.id = s.member_id
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var members []*entity.Member
	for rows.Next() {
		member := &entity.Member{}
		err := rows.Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.RoadmapGoal, &member.MemberFreeSchedule, &member.AccountID, &member.IsActive, &member.PackageName, &member.RegisteredAt)
		if err != nil {
			return nil, err
		}
		members = append(members, member)
	}
	return members, nil
}

func (r *memberRepository) GetAllPaginated(page, limit int) ([]*entity.Member, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "Member"`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	query := `SELECT m.id, COALESCE(m.full_name, ''), COALESCE(m.phone, ''), COALESCE(m.email, ''), COALESCE(m.gender, ''), COALESCE(m.dob, CURRENT_DATE), COALESCE(m.address, ''), COALESCE(m.roadmap_goal, ''), COALESCE(m.member_free_schedule, ''), COALESCE(m.account_id, 0), COALESCE(m.is_active, true), COALESCE(p.package_name, ''), COALESCE(s.registration_date, CURRENT_DATE)
	FROM "Member" m
	LEFT JOIN (
		SELECT DISTINCT ON (member_id) member_id, package_id, registration_date
		FROM "Subscription"
		ORDER BY member_id, id DESC
	) s ON m.id = s.member_id
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id
	ORDER BY m.id DESC LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var members []*entity.Member
	for rows.Next() {
		member := &entity.Member{}
		err := rows.Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.RoadmapGoal, &member.MemberFreeSchedule, &member.AccountID, &member.IsActive, &member.PackageName, &member.RegisteredAt)
		if err != nil {
			return nil, 0, err
		}
		// Set default package name if not set
		if member.PackageName == "" {
			member.PackageName = "Chưa đăng ký"
		}
		members = append(members, member)
	}
	return members, total, nil
}

func (r *memberRepository) Update(member *entity.Member) error {
	var accountID interface{} = member.AccountID
	if member.AccountID == 0 {
		accountID = nil
	}
	query := `UPDATE "Member" SET full_name = $1, phone = $2, email = $3, gender = $4, dob = $5, address = $6, roadmap_goal = $7, member_free_schedule = $8, account_id = $9, is_active = $10 WHERE id = $11`
	_, err := r.db.Exec(query, member.FullName, member.Phone, member.Email, member.Gender, member.DOB, member.Address, member.RoadmapGoal, member.MemberFreeSchedule, accountID, member.IsActive, member.ID)
	return err
}

func (r *memberRepository) UpdateStatus(id int, isActive bool) error {
	query := `UPDATE "Member" SET is_active = $1 WHERE id = $2`
	_, err := r.db.Exec(query, isActive, id)
	return err
}

func (r *memberRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Member" WHERE id = $1`, id)
	return err
}

// GetAllMembersWithDetails - lấy danh sách members với thông tin đầy đủ từ các bảng join
func (r *memberRepository) GetAllMembersWithDetails() ([]*dto.MemberListItemDTO, error) {
	// SQL query join Member với Subscription và MembershipPackage
	// Tính sessionsRemaining = số ngày còn lại từ end_date - today
	query := `
SELECT DISTINCT ON (m.id)
    m.id,
    COALESCE(m.full_name, ''),
    COALESCE(m.phone, ''),
    COALESCE(mp.package_name, 'Chưa đăng ký') as package_name,
    CASE WHEN s.end_date IS NOT NULL AND s.end_date >= CURRENT_DATE THEN 'active' ELSE 'inactive' END as status,
    COALESCE(TO_CHAR(s.end_date, 'YYYY-MM-DD'), '') as end_date,
    COALESCE(TO_CHAR(s.registration_date, 'YYYY-MM-DD'), '') as registration_date,
    COALESCE((s.end_date::date - CURRENT_DATE), 0) as sessions_remaining,
    COALESCE(m.roadmap_goal, '') as roadmap_goal
FROM "Member" m
LEFT JOIN "Subscription" s ON m.id = s.member_id
LEFT JOIN "MembershipPackage" mp ON s.package_id = mp.id
ORDER BY m.id DESC, s.registration_date DESC
`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []*dto.MemberListItemDTO
	for rows.Next() {
		var id int
		var fullName, phone, packageName, status, endDate, startDate, roadmapGoal string
		var sessionsRemaining int

		err := rows.Scan(&id, &fullName, &phone, &packageName, &status, &endDate, &startDate, &sessionsRemaining, &roadmapGoal)
		if err != nil {
			return nil, err
		}

		member := &dto.MemberListItemDTO{
			ID:                id,
			Name:              fullName,
			Phone:             phone,
			Package:           packageName,
			Status:            status,
			ExpiryDate:        endDate,
			JoinDate:          startDate,
			SessionsRemaining: sessionsRemaining,
			RoadmapGoal:       roadmapGoal,
		}

		members = append(members, member)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return members, nil
}

// GetMemberByIDWithDetails - lấy chi tiết member theo ID
func (r *memberRepository) GetMemberByIDWithDetails(id int) (*dto.MemberDetailDTO, error) {
	memberDetail := &dto.MemberDetailDTO{}

	query := `
    SELECT 
        m.id, m.full_name, m.phone, m.email, m.gender, 
        TO_CHAR(m.dob, 'YYYY-MM-DD'), m.address,
        COALESCE(sub.package_name, 'Chưa đăng ký'),
        CASE WHEN sub.end_date IS NOT NULL AND sub.end_date::date >= CURRENT_DATE THEN 'active' ELSE 'inactive' END,
        COALESCE(TO_CHAR(sub.end_date, 'YYYY-MM-DD'), ''),
        COALESCE(TO_CHAR(sub.registration_date, 'YYYY-MM-DD'), ''),
        (sub.end_date IS NOT NULL AND sub.end_date::date >= CURRENT_DATE)
    FROM "Member" m
    LEFT JOIN LATERAL (
        -- Lấy subscription có ngày kết thúc xa nhất (gói hiện tại)
        SELECT s.end_date, s.registration_date, mp.package_name
        FROM "Subscription" s
        JOIN "MembershipPackage" mp ON s.package_id = mp.id
        WHERE s.member_id = m.id
        ORDER BY s.end_date DESC
        LIMIT 1
    ) sub ON true
    WHERE m.id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&memberDetail.ID,
		&memberDetail.FullName,
		&memberDetail.Phone,
		&memberDetail.Email,
		&memberDetail.Gender,
		&memberDetail.DOB,
		&memberDetail.Address,
		&memberDetail.Package,
		&memberDetail.Status,
		&memberDetail.ExpiryDate,
		&memberDetail.JoinDate,
		&memberDetail.IsActive,
	)

	return memberDetail, err
}

// GetByAccountID - lấy thông tin member theo account_id
func (r *memberRepository) GetByAccountID(accountID int) (*entity.Member, error) {
	member := &entity.Member{}
	query := `SELECT id, COALESCE(full_name, ''), COALESCE(phone, ''), COALESCE(email, ''), COALESCE(gender, ''), COALESCE(dob, CURRENT_DATE), COALESCE(address, ''), COALESCE(roadmap_goal, ''), COALESCE(member_free_schedule, ''), account_id, is_active FROM "Member" WHERE account_id = $1`
	err := r.db.QueryRow(query, accountID).Scan(&member.ID, &member.FullName, &member.Phone, &member.Email, &member.Gender, &member.DOB, &member.Address, &member.RoadmapGoal, &member.MemberFreeSchedule, &member.AccountID, &member.IsActive)
	if err != nil {
		return nil, err
	}
	return member, nil
}
