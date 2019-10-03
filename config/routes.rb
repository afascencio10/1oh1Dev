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
  resources :sessions, only: [:index,:create]

  resources :notifications do
    member do
      post :mark_as_read
    end
  end

  resources :users, only:[:new] do
   resources :chats, only: [:show,:create]
  end

  resources :profiles, only: [:show] do
   resources :bookings, only: [:show,:create]
  end


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
