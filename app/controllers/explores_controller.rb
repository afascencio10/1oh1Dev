class ExploresController < ApplicationController
  before_action :authenticate_user!
  before_action :set_explore, only: [:show, :edit, :update, :destroy]

  # GET /explores
  # GET /explores.json
  def index
    @explores = Explore.all
    @top_explores = ExploreRating.rate_desc.where(explore_id: explore_category_ids)
    @popular_explore_category = Category.joins(:explores => :profile).where(:profiles => {:country => country}).distinct
    @popular_guide_category = Category.joins(:guides => :profile).where(:profiles => {:country => country}).distinct
    @popular_incountry = @popular_explore_category.merge(@popular_guide_category)
    @world_popular_explore_category= Category.joins(:explores => :profile).where(:profiles =>{:country => all_countries}).distinct
    @world_popular_guide_category= Category.joins(:guides => :profile).where(:profiles =>{:country => all_countries}).distinct
    @popular_inworld = @world_popular_explore_category.merge(@world_popular_guide_category)

    if !@top_explores.empty?
      @firt_category_name_explore = @top_explores[0].explore.category.name
      @first_category_explore= Explore.where(:category_id => @top_explores[0].explore.category.id).where.not(:profile_id => current_profile_id)
    else
      @firt_category_name_explore = "None"
      @first_category_explore = []
    end

  end

  # GET /explores/1
  # GET /explores/1.json
  def show
    @explore = Explore.find(params[:id])
  end

  # GET /explores/new
  def new
    @explore = Explore.new
  end

  # GET /explores/1/edit
  def edit
  end

  # POST /explores
  # POST /explores.json
  def create
    @profile = Profile.find_by(:user_id=>current_user.id)
    if @profile.nil?
      redirect_to profiles_path, notice: 'Please update about your yourself'
    else

      @list = @profile.explore_categories.uniq.map{|x| x.id}

      @category=params[:category].map{|x| x.to_i}

      @category.each do|x|
        if !@list.include?(x.to_i)
          @explore= Explore.new
          @explore.profile = @profile
          @explore.category = Category.find(x.to_i)
          @explore.save
        end
      end

      @list.each do|x|
        if !@category.include?(x)
          @profile.explore_categories.destroy(Category.find(x))
        end
      end
     flash[:success] = "Explore was successfully created"
     redirect_to profiles_path
   end
  end
  #
  # # PATCH/PUT /explores/1
  # # PATCH/PUT /explores/1.json
  # def update
  #   respond_to do |format|
  #     if @explore.update(explore_params)
  #       format.html { redirect_to @explore, notice: 'Explore was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @explore }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @explore.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end
  #
  # # DELETE /explores/1
  # # DELETE /explores/1.json
  # def destroy
  #   @explore.destroy
  #   respond_to do |format|
  #     format.html { redirect_to explores_url, notice: 'Explore was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end
  #
    private
    # Use callbacks to share common setup or constraints between actions.
    def set_explore
      @explore = Explore.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def explore_params
      params.permit(category:[])
    end

    def current_profile_id
      if Profile.find_by(:user_id => current_user.id)
        Profile.find_by(:user_id => current_user.id).id
      end
    end

    def explore_category_ids
      if Profile.find_by(:user_id => current_user.id)
        profile_id = Profile.find_by(:user_id => current_user.id).id
        category_ids_checked=Profile.find_by(:user_id => current_user.id).explores.map(&:category_id)
        Explore.all.where(category_id: category_ids_checked).where.not(:profile_id => profile_id).map(&:id)
      else
        []
      end
    end

    def guide_category_ids
      if Profile.find_by(:user_id => current_user.id)
        profile = Profile.find_by(:user_id => current_user.id)
        guide_ids_checked = profile.guides.map(&:category_id)
        Guide.all.where(category_id: guide_ids_checked).where.not(:profile_id => profile.id).map(&:id)
      else
        []
      end
    end

    def country
      if Profile.find_by(:user_id => current_user.id)
        Profile.find_by(:user_id => current_user.id).country
      end

    end

    def all_countries
      Profile.all.map(&:country)
    end

end
