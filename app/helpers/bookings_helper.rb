module BookingsHelper
  def timezone(current_user)
    latitude = current_user.profile.latitude
    longitude = current_user.profile.longitude
    return Timezone.lookup(latitude,longitude)
  end
end
