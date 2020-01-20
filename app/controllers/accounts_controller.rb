class AccountsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_account, only: [:show, :edit, :update, :destroy]

  # GET /accounts
  # GET /accounts.json
  def index
    chats = current_user.chats
    @existing_chats_users = current_user.existing_chats_users

    @filterrific = initialize_filterrific(
      User,
      params[:filterrific]
    ) or return
   @users = @filterrific.find.page(params[:page])
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /accounts/1
  # GET /accounts/1.json
  def show
  end

  # GET /accounts/new
  def new
    @account = Account.new
  end

  # GET /accounts/1/edit
  def edit
  end

  # POST /accounts
  # POST /accounts.json
  def create
    @user = current_user
    if @user.valid_password?(params[:current_password])
      if params[:new_password] == params[:re_type_password]
        @user.password = params[:new_password]
        @user.save
        flash.now[:success]= 'Password Changed!!!'
      else
        flash.now[:error]= 'Both Passwords didn\'t match!!!'
      end
    else
      flash.now[:error]= 'Incorrect Current Password!!!'
    end
    @flashing = flash
    respond_to do |format|
      format.js
    end
    # respond_to do |format|
    #   if @account.save
    #     format.html { redirect_to @account, notice: 'Account was successfully created.' }
    #     format.json { render :show, status: :created, location: @account }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @account.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PATCH/PUT /accounts/1
  # PATCH/PUT /accounts/1.json
  def update
    respond_to do |format|
      if @account.update(account_params)
        format.html { redirect_to @account, notice: 'Account was successfully updated.' }
        format.json { render :show, status: :ok, location: @account }
      else
        format.html { render :edit }
        format.json { render json: @account.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /accounts/1
  # DELETE /accounts/1.json
  def destroy
    @account.destroy
    respond_to do |format|
      format.html { redirect_to accounts_url, notice: 'Account was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_account
      @account = Account.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def account_params
      params.fetch(:account, {})
    end
end
