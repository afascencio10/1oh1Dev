class Project < ApplicationRecord
  belongs_to :profile
  serialize :colab_id, Array
end
