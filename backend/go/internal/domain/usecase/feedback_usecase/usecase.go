package feedback_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type FeedbackUsecase interface {
	CreateFeedback(feedback *entity.Feedback) error
	GetFeedbackByID(id int) (*entity.Feedback, error)
	GetAllFeedbacks() ([]*entity.Feedback, error)
	GetAllFeedbacksPaginated(page, limit int, status string) ([]*entity.Feedback, int, error)
	GetFeedbacksByMemberID(memberID int) ([]*entity.Feedback, error)
	UpdateFeedback(feedback *entity.Feedback) error
	DeleteFeedback(id int) error
}

type feedbackUsecase struct {
	create        ICreateFeedbackUseCase
	get           IGetFeedbackUseCase
	list          IListFeedbacksUseCase
	listPaginated IListFeedbacksPaginatedUseCase
	listByMember  IListFeedbacksByMemberIDUseCase
	update        IUpdateFeedbackUseCase
	delete        IDeleteFeedbackUseCase
}

func NewFeedbackUsecase(repo adapter.FeedbackRepository) FeedbackUsecase {
	return &feedbackUsecase{
		create:        NewCreateFeedbackUseCase(repo),
		get:           NewGetFeedbackUseCase(repo),
		list:          NewListFeedbacksUseCase(repo),
		listPaginated: NewListFeedbacksPaginatedUseCase(repo),
		listByMember:  NewListFeedbacksByMemberIDUseCase(repo),
		update:        NewUpdateFeedbackUseCase(repo),
		delete:        NewDeleteFeedbackUseCase(repo),
	}
}

func (u *feedbackUsecase) CreateFeedback(feedback *entity.Feedback) error {
	created, err := u.create.Execute(context.Background(), feedback)
	if err != nil {
		return err
	}
	*feedback = *created
	return nil
}

func (u *feedbackUsecase) GetFeedbackByID(id int) (*entity.Feedback, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *feedbackUsecase) GetAllFeedbacks() ([]*entity.Feedback, error) {
	return u.list.Execute(context.Background())
}

func (u *feedbackUsecase) GetAllFeedbacksPaginated(page, limit int, status string) ([]*entity.Feedback, int, error) {
	return u.listPaginated.Execute(context.Background(), page, limit, status)
}

func (u *feedbackUsecase) UpdateFeedback(feedback *entity.Feedback) error {
	updated, err := u.update.Execute(context.Background(), feedback)
	if err != nil {
		return err
	}
	*feedback = *updated
	return nil
}

func (u *feedbackUsecase) GetFeedbacksByMemberID(memberID int) ([]*entity.Feedback, error) {
	return u.listByMember.Execute(context.Background(), memberID)
}

func (u *feedbackUsecase) DeleteFeedback(id int) error {
	return u.delete.Execute(context.Background(), id)
}
