Rails.application.routes.draw do

  resources :calendars
  resources :bookings
  resources :events
  resources :projects
  resources :helps
  resources :accounts
  resources :messages, only:[:create,:index]
  resources :landing
  resources :profiles
  resources :markets
  resources :explores
  resources :guides
  resources :subscribes
  resources :home
  resources :categories
  resources :sessions
  resources :sessions, only: [:index,:create]
  resources :chests
  resources :reviews
  resources :payment
  resources :products



  resources :notifications do
    member do
      post :mark_as_read
    end
  end

  get '/reservation_calendar' , to: 'sessions#index', as: :reserve_calendar
  get '/states/:country', to: 'helps#states'
  get '/cities/:state/:country', to: 'helps#cities'
  get '/in-session', to: 'bookings#in_session'
  get '/post-session', to: 'bookings#post_session'
  get '/pre-session', to: 'bookings#pre_session'
  post '/webhook', to: 'payment#after_payment'
  get '/profile/about-yourself', to: 'profiles#introduction'
  get '/profile/explores', to: 'profiles#explores'
  get '/profile/guides', to: 'profiles#guides'
  get '/profile/projects', to: 'profiles#projects'
  get '/profile/availabilty', to: 'profiles#availabilty'
  post '/profile/availabilty', to: 'profiles#availabilty_booking_create', as: :availabilty_booking
  get '/profile/completed', to: 'profiles#completed'

  resources :users, only:[:new] do
   resources :chats, only: [:show,:create]
  end

  resources :profiles, only: [:show] do
   resources :bookings, only: [:show,:create]
  end

  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'



  if Rails.env.development?
    devise_for :users, controllers:{
        sessions: "users/sessions",
        registrations: "users/registrations",
        passwords: "users/passwords"
    }
    devise_scope :user do
      unauthenticated do
        root 'landing#index', as: :unauthenticated_root

      end
      authenticated :user do
        root 'home#index', as: :authenticated_root
      end
    end

    mount ActionCable.server, at: '/cable'

    else
      root :to => "subscribes#index"
  end
end
