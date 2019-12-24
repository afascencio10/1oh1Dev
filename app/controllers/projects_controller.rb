class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  # GET /projects
  # GET /projects.json
  def index
    @projects = Project.all
    @profile = current_user.profile
    @project = Project.first
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
          format.html { redirect_to profiles_path, notice: 'Project was successfully created.' }
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
  # def update
  #   respond_to do |format|
  #     if @project.update(project_params)
  #       format.html { redirect_to @project, notice: 'Project was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @project }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @project.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end
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
    @project = Project.find(params[:id])
    respond_to do |format|
      format.js
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    # def set_project
    #   @project = Project.find(params[:id])
    # end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_params
      params.permit(:name,:description,:image,:status,:help,:colab_id)
    end
end
