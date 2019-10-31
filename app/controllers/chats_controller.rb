require 'securerandom'
class ChatsController < ApplicationController
  # before_action :require_login

  def index
  end

  def create
    @other_user = User.find(params[:other_user])
    @chat = find_chat(@other_user) || Chat.new(identifier: SecureRandom.base64(10))
    if !@chat.persisted?
      @chat.save
      @chat.subscriptions.create(user_id: current_user.id)
      @chat.subscriptions.create(user_id: @other_user.id)
    end
    redirect_to user_chat_path(current_user, @chat,  :other_user => @other_user.id)
  end

  def show
    @existing_chats_users = current_user.existing_chats_users
    @other_user = User.find(params[:other_user])
    @chat = Chat.friendly.find(params[:id])
    @message = Message.new
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

private

  def find_chat(second_user)
    chats = current_user.chats
    chats.each do |chat|
      chat.subscriptions.each do |s|
        if s.user_id == second_user.id
          return chat
        end
      end
    end
    nil
  end

  def require_login
    redirect_to new_session_path unless logged_in?
  end

end
