class CategoriesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  def index
    @categories = Category.all
  end

  def show
    @category = Category.friendly.find(params[:id])
  end

  def create
    @category = Category.new(catgeory_params)
    # authorize! :create, @category
    @category.save!
    Notification.create(recipient: User.first, user: User.last, action: "followed", notifiable: User.first)
    flash[:success] = "Category was successfully created!"
    # redirect_to categories_path
  end

  def update
    @category=Category.find(params[:editid]);
    @category.name = params[:name];
    puts(params[:url].empty?);
    if !params[:url].empty?
      @category.url = params[:url];
    end
    @category.save!
    redirect_to categories_path, notice: 'Category was successfully updated.'
  end

  def destroy
    Category.find(params[:id]).delete
    redirect_to categories_path, notice: 'Category was successfully deleted.'

  end
  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def catgeory_params
      params.permit(:name,:url)
    end
end
