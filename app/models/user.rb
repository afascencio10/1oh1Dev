class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :profile
  has_many :messages
  has_many :subscriptions
  has_many :chats, through: :subscriptions
  has_many :notifications, foreign_key: :recipient_id

  self.per_page = 10

  def self.fullname
    self.firstname + self.lastname
  end

  scope :search_query, lambda { |query|
   return nil  if query.blank?

   terms = query.downcase.split(/\s+/)

   terms = terms.map { |e|
     ('%'+e.gsub('*', '%') + '%').gsub(/%+/, '%')
   }
   num_or_conditions = 2
   where(
       terms.map {
         or_clauses = [
             "LOWER(users.firstname) LIKE ?",
             "LOWER(users.email) LIKE ?"
         ].join(' OR ')
         "(#{ or_clauses })"
       }.join(' AND '),
       *terms.map { |e| [e] * num_or_conditions }.flatten
   )
 }
 scope :sorted_by, lambda { |sort_option|
   direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'

   case sort_option.to_s
     when /^created_at_/
       order("users.created_at #{ direction }")
     when /^user_type_name_/
       order("LOWER(user_types.name) #{ direction }")
     else
       raise(ArgumentError, "Invalid sort option: #{ sort_option.inspect }")
   end
 }

  filterrific(
  default_filter_params: { sorted_by: 'created_at_desc' },
  available_filters: [
    :sorted_by,
    :search_query,
  ]
)

  def admin?
  has_role?(:admin)
  end

  def guest?
    has_role?(:guest)
  end

  def existing_chats_users
    existing_chat_users = []
    self.chats.each do |chat|
    existing_chat_users.concat(chat.subscriptions.where.not(user_id: self.id).map {|subscription| subscription.user})
    end
    existing_chat_users.uniq
  end


end
