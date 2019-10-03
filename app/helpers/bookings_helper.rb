module BookingsHelper
  def timezone(current_user)
    state = Profile.find_by(:user_id => current_user.id).state
    coordinates = Geocoder.search(state).first.coordinates
    return Timezone.lookup(coordinates[0],coordinates[1])
  end
end
