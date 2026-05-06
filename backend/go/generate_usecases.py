import os
import shutil
import textwrap

root = os.path.join(os.getcwd(), 'internal', 'domain', 'usecase')
usecases = [
    ('account_usecase', 'Account', 'AccountRepository', 'id', 'ID'),
    ('employee_usecase', 'Employee', 'EmployeeRepository', 'id', 'ID'),
    ('equipment_usecase', 'Equipment', 'EquipmentRepository', 'id', 'ID'),
    ('facility_usecase', 'Facility', 'FacilityRepository', 'id', 'ID'),
    ('feedback_usecase', 'Feedback', 'FeedbackRepository', 'id', 'ID'),
    ('member_usecase', 'Member', 'MemberRepository', 'id', 'ID'),
    ('package_usecase', 'MembershipPackage', 'MembershipPackageRepository', 'id', 'ID'),
    ('pt_detail_usecase', 'PTDetail', 'PTDetailRepository', 'employeeID', 'EmployeeID'),
    ('role_usecase', 'Role', 'RoleRepository', 'id', 'ID'),
    ('service_category_usecase', 'ServiceCategory', 'ServiceCategoryRepository', 'id', 'ID'),
    ('subscription_usecase', 'Subscription', 'SubscriptionRepository', 'id', 'ID'),
    ('training_booking_usecase', 'TrainingBooking', 'TrainingBookingRepository', 'id', 'ID'),
    ('training_session_usecase', 'TrainingSession', 'TrainingSessionRepository', 'id', 'ID'),
]

def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(textwrap.dedent(content).lstrip())

for folder, entity, repo, id_arg, id_field in usecases:
    path = os.path.join(root, folder)
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path, exist_ok=True)
    entity_var = entity[0].lower() + entity[1:]
    short = 'Package' if entity == 'MembershipPackage' else entity
    create_import = ''
    password_logic = ''
    if entity == 'Account':
        create_import = '\n    "errors"\n    "golang.org/x/crypto/bcrypt"'
        password_logic = f'''
            if {entity_var}.Username == "" {{
                return nil, errors.New("username cannot be empty")
            }}
            if len({entity_var}.Password) < 6 {{
                return nil, errors.New("password must be at least 6 characters")
            }}
            hashedPassword, err := bcrypt.GenerateFromPassword([]byte({entity_var}.Password), bcrypt.DefaultCost)
            if err != nil {{
                return nil, err
            }}
            {entity_var}.Password = string(hashedPassword)
'''

    write(os.path.join(path, 'create.go'), f'''
        package {folder}

        import (
            "context"
            "gym-management/internal/domain/adapter"
            "gym-management/internal/domain/entity"{create_import}
        )

        type ICreate{short}UseCase interface {{
            Execute(ctx context.Context, {entity_var} *entity.{entity}) (*entity.{entity}, error)
        }}

        type Create{short}UseCase struct {{
            repo adapter.{repo}
        }}

        func NewCreate{short}UseCase(repo adapter.{repo}) ICreate{short}UseCase {{
            return &Create{short}UseCase{{repo: repo}}
        }}

        func (u *Create{short}UseCase) Execute(ctx context.Context, {entity_var} *entity.{entity}) (*entity.{entity}, error) {{
{password_logic}
            err := u.repo.Create({entity_var})
            return {entity_var}, err
        }}
    ''')

    write(os.path.join(path, 'get.go'), f'''
        package {folder}

        import (
            "context"
            "errors"
            "gym-management/internal/domain/adapter"
            "gym-management/internal/domain/entity"
        )

        type IGet{short}UseCase interface {{
            Execute(ctx context.Context, {id_arg} int) (*entity.{entity}, error)
        }}

        type Get{short}UseCase struct {{
            repo adapter.{repo}
        }}

        func NewGet{short}UseCase(repo adapter.{repo}) IGet{short}UseCase {{
            return &Get{short}UseCase{{repo: repo}}
        }}

        func (u *Get{short}UseCase) Execute(ctx context.Context, {id_arg} int) (*entity.{entity}, error) {{
            if {id_arg} <= 0 {{
                return nil, errors.New("invalid {id_arg}")
            }}
            return u.repo.GetByID({id_arg})
        }}
    ''')

    write(os.path.join(path, 'list.go'), f'''
        package {folder}

        import (
            "context"
            "gym-management/internal/domain/adapter"
            "gym-management/internal/domain/entity"
        )

        type IList{short}sUseCase interface {{
            Execute(ctx context.Context) ([]*entity.{entity}, error)
        }}

        type List{short}sUseCase struct {{
            repo adapter.{repo}
        }}

        func NewList{short}sUseCase(repo adapter.{repo}) IList{short}sUseCase {{
            return &List{short}sUseCase{{repo: repo}}
        }}

        func (u *List{short}sUseCase) Execute(ctx context.Context) ([]*entity.{entity}, error) {{
            return u.repo.GetAll()
        }}
    ''')

    write(os.path.join(path, 'update.go'), f'''
        package {folder}

        import (
            "context"
            "errors"
            "gym-management/internal/domain/adapter"
            "gym-management/internal/domain/entity"
        )

        type IUpdate{short}UseCase interface {{
            Execute(ctx context.Context, {entity_var} *entity.{entity}) (*entity.{entity}, error)
        }}

        type Update{short}UseCase struct {{
            repo adapter.{repo}
        }}

        func NewUpdate{short}UseCase(repo adapter.{repo}) IUpdate{short}UseCase {{
            return &Update{short}UseCase{{repo: repo}}
        }}

        func (u *Update{short}UseCase) Execute(ctx context.Context, {entity_var} *entity.{entity}) (*entity.{entity}, error) {{
            if {entity_var}.{id_field} <= 0 {{
                return nil, errors.New("invalid {id_arg}")
            }}
            if err := u.repo.Update({entity_var}); err != nil {{
                return nil, err
            }}
            return {entity_var}, nil
        }}
    ''')

    write(os.path.join(path, 'delete.go'), f'''
        package {folder}

        import (
            "context"
            "errors"
            "gym-management/internal/domain/adapter"
        )

        type IDelete{short}UseCase interface {{
            Execute(ctx context.Context, {id_arg} int) error
        }}

        type Delete{short}UseCase struct {{
            repo adapter.{repo}
        }}

        func NewDelete{short}UseCase(repo adapter.{repo}) IDelete{short}UseCase {{
            return &Delete{short}UseCase{{repo: repo}}
        }}

        func (u *Delete{short}UseCase) Execute(ctx context.Context, {id_arg} int) error {{
            if {id_arg} <= 0 {{
                return errors.New("invalid {id_arg}")
            }}
            return u.repo.Delete({id_arg})
        }}
    ''')

    write(os.path.join(path, 'usecase.go'), f'''
        package {folder}

        import (
            "context"
            "gym-management/internal/domain/adapter"
            "gym-management/internal/domain/entity"
        )

        type {short}Usecase interface {{
            Create{short}({entity_var} *entity.{entity}) error
            Get{short}ByID(id int) (*entity.{entity}, error)
            GetAll{short}s() ([]*entity.{entity}, error)
            Update{short}({entity_var} *entity.{entity}) error
            Delete{short}(id int) error
        }}

        type {entity_var}Usecase struct {{
            create ICreate{short}UseCase
            get    IGet{short}UseCase
            list   IList{short}sUseCase
            update IUpdate{short}UseCase
            delete IDelete{short}UseCase
        }}

        func New{short}Usecase(repo adapter.{repo}) {short}Usecase {{
            return &{entity_var}Usecase{{
                create: NewCreate{short}UseCase(repo),
                get:    NewGet{short}UseCase(repo),
                list:   NewList{short}sUseCase(repo),
                update: NewUpdate{short}UseCase(repo),
                delete: NewDelete{short}UseCase(repo),
            }}
        }}

        func (u *{entity_var}Usecase) Create{short}({entity_var} *entity.{entity}) error {{
            created, err := u.create.Execute(context.Background(), {entity_var})
            if err != nil {{
                return err
            }}
            *{entity_var} = *created
            return nil
        }}

        func (u *{entity_var}Usecase) Get{short}ByID(id int) (*entity.{entity}, error) {{
            return u.get.Execute(context.Background(), id)
        }}

        func (u *{entity_var}Usecase) GetAll{short}s() ([]*entity.{entity}, error) {{
            return u.list.Execute(context.Background())
        }}

        func (u *{entity_var}Usecase) Update{short}({entity_var} *entity.{entity}) error {{
            updated, err := u.update.Execute(context.Background(), {entity_var})
            if err != nil {{
                return err
            }}
            *{entity_var} = *updated
            return nil
        }}

        func (u *{entity_var}Usecase) Delete{short}(id int) error {{
            return u.delete.Execute(context.Background(), id)
        }}
    ''')

print('generated', len(usecases), 'usecases')
