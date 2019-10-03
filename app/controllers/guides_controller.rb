class GuidesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_guide, only: [:show, :edit, :update, :destroy]

  # GET /guides
  # GET /guides.json
  def index
    @guides = Guide.all
  end

  # GET /guides/1
  # GET /guides/1.json
  def show
    @guide = Guide.find(params[:id])
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
    @profile = Profile.find_by(:user_id=>current_user.id)
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
  #
  # # PATCH/PUT /guides/1
  # # PATCH/PUT /guides/1.json
  # def update
  #   respond_to do |format|
  #     if @guide.update(guide_params)
  #       format.html { redirect_to @guide, notice: 'Guide was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @guide }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @guide.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end
  #
  # # DELETE /guides/1
  # # DELETE /guides/1.json
  # def destroy
  #   @guide.destroy
  #   respond_to do |format|
  #     format.html { redirect_to guides_url, notice: 'Guide was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end
  #
  # private
  #   # Use callbacks to share common setup or constraints between actions.
    def set_guide
      @guide = Guide.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def guide_params
      params.permit(category:[])
    end
end
