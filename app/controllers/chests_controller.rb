class ChestsController < ApplicationController
  def index
    @explore_amount = current_profile.wallet_histories.where(:source => "Explore").sum(:cost)
    @guide_amount = current_profile.wallet_histories.where(:source => "Guide").sum(:cost)
    @available_balance = current_profile.wallet.coins
  end
end
