module ApplicationHelper
  include LocalTimeHelper

  def resource_name
    :user
  end

  def resource_class
    User
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def flash_class(level)
    case level
      when 'notice' then "alert-info"
      when 'success' then "alert-success"
      when 'error' then "alert-danger"
      when 'alert' then "alert-warning"
    end
  end

  def flash_icon(level)
    case level
      when 'notice' then "info"
      when 'success' then "check"
      when 'error' then "error"
      when 'alert' then "warning"
    end
  end

  def javascript(*files)
    content_for(:head) { javascript_include_tag(*files) }
  end


end
