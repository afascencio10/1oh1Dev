class ProductsController < ApplicationController
  def index
    @products = Market.all
  end
end
