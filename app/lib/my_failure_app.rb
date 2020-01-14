class MyFailureApp < Devise::FailureApp
  def route(scope)
    :unauthenticated_root_url
  end
end