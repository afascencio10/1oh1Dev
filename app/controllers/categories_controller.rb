class CategoriesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  def index
    @categories = Category.all
    @categories = @categories.paginate(:page => params[:page], :per_page => 10)
  end

  def show
    @type = params[:type]
    @category = Category.friendly.find(params[:id])
    if @type =="explores"
      @model = Explore.includes(profile: :user)
    elsif params[:type]=="guides"
      @model = Guide.includes(profile: :user)
    else
      @model = Explore.includes(profile: :user)
    end
    @filterrific = initialize_filterrific(
      @model,
      params[:filterrific],
      select_options: {
        :with_country_name => Profile.options_for_select
      }
    ) or return
    @profiles = @filterrific.find.page(params[:page])

    @profiles= @profiles.where(category_id: @category.id).where.not(:profile => current_user.profile)
    # @profiles = @profiles.paginate(:page => params[:page], :per_page => 3)

    respond_to do |format|
      format.html
      format.js
    end
  end

  def create
    @category = Category.new(catgeory_params)
    # authorize! :create, @category
    @category.save!
    # Notification.create(recipient: User.first, user: User.last, action: "followed", notifiable: User.first)
    flash[:success] = "Category was successfully created!"
    redirect_to categories_path
  end

  def update
    @category=Category.find(params[:editid]);
    @category.name = params[:name];
    @category.description = params[:description];
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
      params.permit(:name,:url,:description)
    end

end
