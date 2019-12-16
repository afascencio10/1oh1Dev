class GuidesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_guide, only: [:show, :edit, :update, :destroy]

  # GET /guides
  # GET /guides.json
  def index
    @guides = Guide.all
    category_explores_profiles_join = Category.joins(explores: :profile)
    category_guides_profiles_join = Category.joins(guides: :profile)

    @top_guides = GuideRating.rate_desc.where(guide_id: not_self_guide_category_ids)
    @popular_explore_category = category_explores_profiles_join.distinct_country(country)
    @popular_guide_category = category_guides_profiles_join.distinct_country(country)
    @popular_incountry = @popular_explore_category.merge(@popular_guide_category)
    @world_popular_explore_category= category_explores_profiles_join.distinct_country(all_countries)
    @world_popular_guide_category= category_guides_profiles_join.distinct_country(all_countries)
    @popular_inworld = @world_popular_explore_category.merge(@world_popular_guide_category)

    if !@top_guides.empty?
      @first_category = @top_guides[0].guide.category
      @first_category_name_guide = @first_category.name
      @first_category_guide= @guides.includes(:category,profile: :user).where(:category_id => @first_category.id).where.not(:profile_id => current_profile_id)
    else
      @first_category_name_guide = "None"
      @first_category_guide = []
    end

  end

  # GET /guides/1
  # GET /guides/1.json
  def show
    # @guide = Guide.find(params[:id])
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
    if @profile.nil?
      redirect_to profiles_path, notice: 'Please update about your yourself'
    else
      @list = @profile.guide_categories.uniq.map{|x| x.id}

      @category=params[:category].map{|x| x.to_i}

      @category.each do|x|
        if !@list.include?(x.to_i)
          @guide = Guide.new
          @guide.profile = @profile
          @guide.category = Category.find(x.to_i)
          @guide.save
        end
      end

      @list.each do|x|
        if !@category.include?(x)
          @profile.guide_categories.destroy(Category.find(x))
        end
      end
       flash[:success] = "Guide was successfully created."
      redirect_to profiles_path
    end
  end

  private
    def set_guide
      @guide = Guide.find(params[:id])
    end

    def guide_params
      params.permit(category:[])
    end
    def current_profile_id
      if current_user.profile
        current_user.profile.id
      end
    end

    def not_self_guide_category_ids
      if current_user.profile
        guide_ids_checked = current_user.profile.guides.pluck(:category_id)
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

    def all_countries
      Profile.pluck(:country).uniq
    end
end
