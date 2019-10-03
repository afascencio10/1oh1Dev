class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_message, only: [:show, :edit, :update, :destroy]

  # GET /messages
  # GET /messages.json
  # def index
  #   @messages = Message.all
  # end

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
