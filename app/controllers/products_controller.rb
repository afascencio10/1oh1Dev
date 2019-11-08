class ProductsController < ApplicationController
  def index
    @products = Market.all
    @product = Market.new
  end

  def new
  end

  def create
  end

  def update
  end

  def destroy
  end

end
