module BookingsHelper
  def timezone(current_user)
    state = current_user.profile.state
    coordinates = Geocoder.search(state).first.coordinates
    return Timezone.lookup(coordinates[0],coordinates[1])
  end
end
