class ChangeProductsToTransactions < ActiveRecord::Migration[5.0]
  def change
    rename_table :products, :transactions
  end
end
