# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200113203222) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "bookings", force: :cascade do |t|
    t.string   "title"
    t.datetime "start"
    t.datetime "end"
    t.string   "duration"
    t.datetime "cancel_date"
    t.integer  "status"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "guide_id"
    t.integer  "explore_id"
    t.string   "identifier"
    t.string   "slug"
    t.string   "description"
    t.integer  "client_id"
    t.integer  "recipient_id"
    t.integer  "coins"
  end

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.string   "url"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "slug"
    t.string   "description"
  end

  create_table "categories_projects", id: false, force: :cascade do |t|
    t.integer "category_id", null: false
    t.integer "project_id",  null: false
  end

  create_table "chats", force: :cascade do |t|
    t.string   "identifier"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "slug"
  end

  create_table "explore_ratings", force: :cascade do |t|
    t.string   "review"
    t.float    "rating"
    t.integer  "profile_id"
    t.integer  "guide_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "explore_id"
    t.integer  "category_id"
    t.index ["category_id"], name: "index_explore_ratings_on_category_id", using: :btree
  end

  create_table "explores", force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "profile_id"
    t.integer  "category_id"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string   "slug",                      null: false
    t.integer  "sluggable_id",              null: false
    t.string   "sluggable_type", limit: 50
    t.string   "scope"
    t.datetime "created_at"
  end

  create_table "guide_ratings", force: :cascade do |t|
    t.string   "review"
    t.float    "rating"
    t.integer  "profile_id"
    t.integer  "explore_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "guide_id"
    t.integer  "category_id"
    t.index ["category_id"], name: "index_guide_ratings_on_category_id", using: :btree
  end

  create_table "guides", force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "profile_id"
    t.integer  "category_id"
  end

  create_table "helps", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "markets", force: :cascade do |t|
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "name"
    t.string   "currency"
    t.string   "mode"
    t.string   "interval"
    t.integer  "price"
    t.string   "offer"
    t.string   "description"
    t.string   "stripe_id"
  end

  create_table "messages", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text     "content"
    t.integer  "user_id"
    t.integer  "chat_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "recipient_id"
    t.string   "action"
    t.string   "notifiable_type"
    t.integer  "notifiable_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.datetime "read_at"
    t.string   "url"
  end

  create_table "profiles", force: :cascade do |t|
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "user_id"
    t.string   "state"
    t.string   "country"
    t.string   "profile_photo"
    t.string   "banner_photo"
    t.string   "languages"
    t.string   "bio"
    t.string   "contact_no"
    t.date     "birth_date"
    t.string   "city"
    t.string   "slug"
    t.string   "time_zone"
  end

  create_table "projects", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "status"
    t.string   "image"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "profile_id"
    t.string   "colab_id"
    t.boolean  "help"
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.string   "resource_type"
    t.integer  "resource_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "subscribes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "email"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.integer  "chat_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "transactions", force: :cascade do |t|
    t.integer  "profile_id"
    t.string   "name"
    t.string   "currency"
    t.string   "mode"
    t.string   "interval"
    t.integer  "price"
    t.string   "customer_id"
    t.string   "product_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "charge_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "firstname"
    t.string   "lastname"
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  create_table "video_sessions", force: :cascade do |t|
    t.integer  "booking_id"
    t.integer  "profile_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "wallet_histories", force: :cascade do |t|
    t.integer "wallet_id"
    t.integer "cost"
    t.integer "prev_bal"
    t.integer "new_bal"
    t.string  "action_type"
    t.integer "action_id"
    t.string  "source"
    t.index ["action_type", "action_id"], name: "index_wallet_histories_on_action_type_and_action_id", using: :btree
    t.index ["wallet_id"], name: "index_wallet_histories_on_wallet_id", using: :btree
  end

  create_table "wallets", force: :cascade do |t|
    t.integer "profile_id"
    t.integer "coins"
    t.index ["profile_id"], name: "index_wallets_on_profile_id", using: :btree
  end

  add_foreign_key "bookings", "explores", name: "bookings_explore_id_fkey", on_delete: :nullify
  add_foreign_key "bookings", "guides", name: "bookings_guide_id_fkey", on_delete: :nullify
  add_foreign_key "explore_ratings", "categories"
  add_foreign_key "explore_ratings", "explores", name: "explore_ratings_explore_id_fkey", on_delete: :cascade
  add_foreign_key "explore_ratings", "guides", name: "explore_ratings_guide_id_fkey", on_delete: :cascade
  add_foreign_key "explore_ratings", "profiles", name: "explore_ratings_profile_id_fkey"
  add_foreign_key "explores", "categories", name: "explores_category_id_fkey", on_delete: :cascade
  add_foreign_key "explores", "profiles", name: "explores_profile_id_fkey"
  add_foreign_key "guide_ratings", "categories"
  add_foreign_key "guide_ratings", "explores", name: "guide_ratings_explore_id_fkey", on_delete: :cascade
  add_foreign_key "guide_ratings", "guides", name: "guide_ratings_guide_id_fkey", on_delete: :cascade
  add_foreign_key "guide_ratings", "profiles", name: "guide_ratings_profile_id_fkey"
  add_foreign_key "guides", "categories", name: "guides_category_id_fkey", on_delete: :cascade
  add_foreign_key "guides", "profiles", name: "guides_profile_id_fkey"
  add_foreign_key "notifications", "users", name: "notifications_user_id_fkey"
  add_foreign_key "profiles", "users", name: "profiles_user_id_fkey"
  add_foreign_key "projects", "profiles", name: "projects_profile_id_fkey"
  add_foreign_key "transactions", "profiles", name: "transactions_profile_id_fkey"
  add_foreign_key "wallet_histories", "wallets"
  add_foreign_key "wallets", "profiles"
end
