class ExploresController < ApplicationController
  before_action :authenticate_user!,except: [:show]
  before_action :set_explore, only: [:show, :edit, :update, :destroy]
  include ExploresHelper
  # GET /explores
  # GET /explores.json
  def index
    @explores = Explore.all

    @top_explores = ExploreRating.includes(profile: :user,explore: [:category]).rate_desc.where(explore_id: not_self_explore_category_ids).pluck(:explore_id).uniq.map{|x| Explore.find(x)}
    @popular_incountry = popular_merge(country,nil)
    @world_popular_explore_category = Category.joins(explores: :profile).distinct_country(all_countries)

    if !@top_explores.empty?
      @category = @top_explores[0].category
      @first_category_name_explore =  @category.name
      @first_category_explore= @explores.includes(:category,profile: :user).where(:category_id => @category.id).where.not(:profile_id => current_profile_id)
    else
      @first_category_name_explore = "None"
      @first_category_explore = []
    end

  end

  # GET /explores/1
  # GET /explores/1.json
  def show
    @explore_ratings = @explore.profile.explore_ratings
    @guide_ratings = @explore.profile.guide_ratings
    @projects = @explore.profile.projects

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
    @profile = current_user.profile

    if (params[:first_signup] == "true")
      #first signup explores update
      @list = @profile.explore_categories.pluck(:id).uniq
      @category = JSON.parse(params["exploreCategories"])["exp_categories"]
      # @categories_to_add = @selected_categories.reject{|x| @saved_categories.include? x.to_i}

      @add_cat = @category - @list
      @del_cat = @list - @category

      @add_cat.each do |x|
         @explore= Explore.new
         @explore.profile = @profile
         @explore.category = Category.find(x)
         @explore.save
       end
       @del_cat.each do |x|
         @profile.explore_categories.destroy(Category.find(x))
       end

       respond_to do |format|
         format.html { redirect_to '/profile/guides', notice: 'Explores was successfully added.' }
         format.json { render :show, status: :ok, location: @profile }
       end

    else
      #edit categories from profile page
       @list = @profile.explore_categories.pluck(:id).uniq
       @category = JSON.parse(params["exploreCategories"])["exp_categories"]

       @add_cat = @category - @list
       @del_cat = @list - @category

       @add_cat.each do |x|
         @explore= Explore.new
         @explore.profile = @profile
         @explore.category = Category.find(x.to_i)
         @explore.save
       end

       @del_cat.each do |x|
         @profile.explore_categories.destroy(Category.find(x))
       end

      flash[:success] = "Explore was successfully created"
      redirect_to profiles_path
    end
  end

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
    if current_user.profile
      current_user.profile.id
    end
  end

  def not_self_explore_category_ids
    if current_user.profile
      category_ids_checked= current_user.profile.explores.pluck(:category_id)
      Explore.where(category_id: category_ids_checked).where.not(:profile_id => current_profile_id).pluck(:id)
    else
      []
    end
  end

  def country
    if current_user.profile
      current_user.profile.country
    end
  end

end
