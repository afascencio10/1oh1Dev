class GuidesController < ApplicationController
  before_action :authenticate_user!,except: [:show]
  before_action :set_guide, only: [:show, :edit, :update, :destroy]
  include ExploresHelper
  # GET /guides
  # GET /guides.json
  def index
    @guides = Guide.all
    if guide_params[:search]
      puts Category.where("name LIKE ?","%#{guide_params[:search]}%" )
    else
      @top_guides = GuideRating.rate_desc.where(guide_id: not_self_guide_category_ids).pluck(:guide_id).uniq.map{|x| Guide.find(x)}
      @popular_incountry = popular_merge(country,nil)
      @world_popular_guide_category= Category.joins(guides: :profile).distinct_country(all_countries)

      if !@top_guides.empty?
        @first_category = @top_guides[0].category
        @first_category_name_guide = @first_category.name
        @first_category_guide= @guides.includes(:category,profile: :user).where(:category_id => @first_category.id).where.not(:profile_id => current_profile_id)
      else
        @first_category_name_guide = "None"
        @first_category_guide = []
      end
    end
  end

  # GET /guides/1
  # GET /guides/1.json
  def show
    @explore_ratings = @guide.profile.explore_ratings
    @guide_ratings = @guide.profile.guide_ratings
    @projects = @guide.profile.projects
  end

  # GET /guides/new
  def new
    @guide = Guide.new
  end

  # GET /guides/1/edit
  def edit
  end

  # POST /guides
  # POST /guides.json
  def create
    @profile = current_user.profile
    @saved_categories = @profile.guide_categories.pluck(:id).uniq

    if params[:first_signup] == "true"
      #first signup explores update
      # @selected_categories = JSON.parse(params["guideCategories"])["categories"]
      # @categories_to_add = @selected_categories.reject{|x| @saved_categories.include? x.to_i}
      @listg = @profile.guide_categories.pluck(:id).uniq
      @category = JSON.parse(params["guideCategories"])["guid_categories"]
      @add_cat = @category - @listg
      @del_cat = @listg - @category

        @add_cat.each do |x|
         @guide= Guide.new
         @guide.profile = @profile
         @guide.category = Category.find(x)
         @guide.save
        end

       @del_cat.each do |x|
         @profile.guide_categories.destroy(Category.find(x))
       end

       respond_to do |format|
         format.html { redirect_to '/profile/projects', notice: 'Guides was successfully added.' }
         format.json { render :show, status: :ok, location: @profile }
       end
    else
      if @profile.nil?
        redirect_to profiles_path, notice: 'Please update about your yourself'
      else
        @listg = @profile.guide_categories.pluck(:id).uniq
        @category = JSON.parse(params["guideCategories"])["guid_categories"]

        @add_cat = @category - @listg
        @del_cat = @listg - @category

        @add_cat.each do |x|
          @explore= Guide.new
          @explore.profile = @profile
          @explore.category = Category.find(x.to_i)
          @explore.save
        end

        @del_cat.each do |x|
          @profile.guide_categories.destroy(Category.find(x))
        end

        # @category=params[:category].map{|x| x.to_i}
        #
        # @category.each do|x|
        #   if !@list.include?(x.to_i)
        #     @guide = Guide.new
        #     @guide.profile = @profile
        #     @guide.category = Category.find(x.to_i)
        #     @guide.save
        #   end
        # end
        #
        # @list.each do|x|
        #   if !@category.include?(x)
        #     @profile.guide_categories.destroy(Category.find(x))
        #   end
        # end
         flash[:success] = "Guide was successfully created."
        redirect_to profiles_path
      end
    end

  end

  private
    def set_guide
      @guide = Guide.find(params[:id])
    end

    def guide_params
      params.permit(:search,category:[])
    end
    def current_profile_id
      if current_user.profile
        current_user.profile.id
      end
    end

    def not_self_guide_category_ids
      if current_user.profile
        guide_ids_checked = current_user.profile.guides.pluck(:category_id).uniq
        Guide.where(category_id: guide_ids_checked).where.not(:profile_id => current_profile_id).pluck(:id)
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
