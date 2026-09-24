from geopy.geocoders import Nominatim
from geopy.distance import distance
from .models import  User,Cart,CartItem,Order,Request,Courier_Manager,PackageTracking

# functon to get city dict from sender_city, recipient_city
def get_city_dict(sender_city, recipient_city):
    # Initialize the result dictionary
    sender_courier_manager = Courier_Manager.query.filter_by(courier_manager_city=sender_city).first()
    recipient_courier_manager = Courier_Manager.query.filter_by(courier_manager_city=recipient_city).first()

    intermediate_cities = Courier_Manager.query.with_entities(Courier_Manager.courier_manager_city,
                                                             Courier_Manager.courier_manager_latitude,
                                                             Courier_Manager.courier_manager_longitude).distinct().all()

    city_dict = {}

    # Add sender city
    city_dict[sender_city] = {
        "latitude": sender_courier_manager.courier_manager_latitude,
        "longitude": sender_courier_manager.courier_manager_longitude,
    }

    # Add intermediate cities
    for city, latitude, longitude in intermediate_cities:
        if city != sender_city and city != recipient_city:
            city_dict[city] = {
                "latitude": latitude,
                "longitude": longitude,
            }

    # Add recipient city
    city_dict[recipient_city] = {
        "latitude": recipient_courier_manager.courier_manager_latitude,
        "longitude": recipient_courier_manager.courier_manager_longitude,
    }

    return city_dict

# functon to get haversine distance from sender_city, recipient_city
def haversine_distance(coord1, coord2):
    import math
    # Calculate the Haversine distance between two latitude and longitude coordinates
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    radius = 6371  # Earth's radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * (math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = radius * c
    return distance

# functon to get calculate total distance  from sender_city, recipient_city
def calculate_total_distance(path, city_dict):
    # Calculate the total distance for a given path
    total_distance = 0
    for i in range(len(path) - 1):
        city1 = path[i]
        city2 = path[i + 1]
        total_distance += haversine_distance(
            (city_dict[city1]['latitude'], city_dict[city1]['longitude']),
            (city_dict[city2]['latitude'], city_dict[city2]['longitude'])
        )
    return total_distance

# functon to get shortest path from sender_city, recipient_city
def short_path(city_dict):
    import itertools
    cities = list(city_dict.keys())
    origin_city = cities[0]
    last_city = cities[-1]

    # Generate all possible permutations of intermediate cities
    intermediate_cities = cities[1:-1]
    shortest_path = [origin_city, last_city]  # Initialize with origin and last cities
    shortest_distance = calculate_total_distance(shortest_path, city_dict)

    for num_intermediates in range(0, len(intermediate_cities) + 1):
        intermediate_permutations = list(itertools.permutations(intermediate_cities, num_intermediates))

        for permutation in intermediate_permutations:
            path = [origin_city] + list(permutation) + [last_city]
            distance = calculate_total_distance(path, city_dict)

            if distance < shortest_distance:
                shortest_path = path
                shortest_distance = distance

    return shortest_path, shortest_distance

# functon to get totalprice for a courier based on every thing
def totalprice(shortest_distance,package_number, weight, height, width, delivery_preferences):
    if delivery_preferences == 'premium':
        total_price_weight = 0.2
    else:
        total_price_weight = 0.01
    
    distance_price = float(shortest_distance) * float(total_price_weight)
    weight_price = float(weight) * float(height) * float(width)*float(package_number)
    total_price = (distance_price + weight_price)/1000
    
    return total_price