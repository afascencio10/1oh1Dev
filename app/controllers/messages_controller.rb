class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_message, only: [:show, :edit, :update, :destroy]

  # GET /messages
  # GET /messages.json
  def index
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

  def create
    message = Message.new(message_params)
    message.user = current_user
    if message.save
          #broadcasting out to messages channel including the chat_id so messages are broadcasted to specific chat only
          ActionCable.server.broadcast( "messages_#{message_params[:chat_id]}",
          #message and user hold the data we render on the page using javascript
          message: message.content,
          user: message.user.firstname,
          other_user: params[:message][:other_user],
          user_id: message.user_id,
          )
        else
          redirect_to chats_path
    end
  end

  private
      def message_params
        params.require(:message).permit(:content, :chat_id)
      end
end
