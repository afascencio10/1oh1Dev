class Project < ApplicationRecord
  belongs_to :profile
  has_and_belongs_to_many :categories
  serialize :colab_id, Array

  scope :sort_by_created_desc, -> {order(created_at: :desc)}
end
