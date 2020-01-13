class ProjectsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  # GET /projects
  # GET /projects.json
  def index
    @projects = Project.all
    @profile = current_user.profile
    @project = Project.includes(:profile,:categories)
    @popular_projects = @project.where(:profiles=>{:country=>"India"}).limit(4)
    @popular_in_country = @project.where(:profiles=>{:country=>current_profile.country}).where.not("profile_id = ?",current_profile.id )
  end

  # GET /projects/1
  # GET /projects/1.json
  def show
  end

  # GET /projects/new
  def new
    @project = Project.new
  end

  # GET /projects/1/edit
  def edit
  end

  # POST /projects
  # POST /projects.json
  def create
    changed_params = project_params
    changed_params[:colab_id]=JSON.parse(params["create-project-collaborators"])
    project_categories = JSON.parse(params["create-project-categories"])
    @project = Project.new(changed_params)
    @project.profile = current_user.profile

    if @project.nil?
      redirect_to profiles_path, notice: 'Please update about your yourself'
    else
      respond_to do |format|
        if @project.save
          project_categories.each do |i|
            @project.categories << Category.find(i.to_i)
          end

          flash.now[:success]= 'Project was successfully created.'
          @flashing = flash

          @projects = current_user.profile.projects.includes(:categories).sort_by_created_desc
          format.html { redirect_to profiles_path, success: 'Project was successfully created.' }
          format.js
        else
          format.html { render :new }
          format.json { render json: @project.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # PATCH/PUT /projects/1
  # PATCH/PUT /projects/1.json
  def update
    @params = project_params
    @project = Project.includes(:categories).find(params[:edit_id])

    if !@project.image.nil? & params["image"].empty?
      @params[:image] = @project.image
    else
      @params[:image]= params["image"]
    end

    if !@project.colab_id.empty? & params["edit-project-collaborators"].empty?
      @params[:colab_id] = @project.colab_id
    else
      @params[:colab_id]=JSON.parse(params["edit-project-collaborators"])
    end

    if !@project.categories.empty? & params["edit-project-categories"].empty?
      @project_categories = @project.categories.pluck(:id).map{|x| x.to_s}
    else
      @project_categories = JSON.parse(params["edit-project-categories"])
    end

    puts @params


    # @projects = current_user.profile.projects.includes(:categories).sort_by_created_desc
    # respond_to do |format|
    #   format.html { redirect_to profile_path, notice: 'Project was successfully updated.' }
    #   format.js
    # end
    @categories = @project.categories.pluck(:id).map{|x| x.to_s}
    @edit_category = @project_categories
    @add_cat = @edit_category - @categories
    # @del_cat = @categories - @edit_category

    # puts @add_cat
    # puts "dele"
    # puts @del_cat
    flash.now[:success]= 'Project was successfully edited.'
    @flashing = flash
    respond_to do |format|
      if @project.update(@params)
        @add_cat.each do |x|
          @project.categories << Category.find(x.to_i)
        end
        # @del_cat.each do |x|
        #   @project.categories.destroy(Category.find(x.to_i))
        # end
        flash.now[:success]= 'Project was successfully edited.'
        @flashing = flash
        @projects = current_user.profile.projects.sort_by_created_desc
        format.html { redirect_to profiles_path, notice: 'Project was successfully updated.' }
        format.js
      else
        format.html { render :edit }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end
  #
  # # DELETE /projects/1
  # # DELETE /projects/1.json
  # def destroy
  #   @project.destroy
  #   respond_to do |format|
  #     format.html { redirect_to projects_url, notice: 'Project was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end

  def open_edit_project_modal
    @project = Project.includes(:categories).find(params[:id])
    @colab_ids = @project.colab_id
    @categories_id = @project.categories.pluck(:id)
    respond_to do |format|
      format.js
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    def current_profile
      current_user.profile
    end
    # Never trust parameters from the scary internet, only allow the white list through.
    def project_params
      params.permit(:name,:description,:image,:status,:help,:colab_id)
    end
end
