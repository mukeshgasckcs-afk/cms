import pygal
from .models import User, Request, Courier_Manager, Order

chart_style = pygal.style.LightStyle()

# Generic function to create a bar graph
def generate_bar_graph(data, labels, xlabel, ylabel, title, image_path):
    bar_chart = pygal.Bar(style=chart_style, height=800, width=800)
    bar_chart.x_labels = labels
    bar_chart.add(xlabel, data)
    bar_chart.title = title
    bar_chart.y_title = ylabel
    bar_chart.x_title = xlabel
    bar_chart.render_to_file(image_path)

# Logic of graphs
def generate_graphs():
    all_users = User.query.all()
    all_requests = Request.query.all()
    all_courier_managers = Courier_Manager.query.all()
    all_orders = Order.query.all()

    # Example: Bar Plot for the number of users per role
    roles = ['admin', 'manager', 'regular user']
    user_counts = [len([user for user in all_users if user.role == role]) for role in roles]
    generate_bar_graph(user_counts, roles, 'User Role', 'Number of Users', 'User Role Distribution', 'System/application/static/summary/user_role_distribution.svg')

    # Example: Bar Plot for the status of requests
    request_statuses = ['pending', 'approved', 'rejected']
    request_counts = [len([request for request in all_requests if request.status == status]) for status in request_statuses]
    generate_bar_graph(request_counts, request_statuses, 'Request Status', 'Number of Requests', 'Request Status Distribution', 'System/application/static/summary/request_status_distribution.svg')

    # Bar Plot for the number of orders per user
    user_names = [user.name for user in all_users]
    user_order_counts = [len([order for order in all_orders if order.user.name == name]) for name in user_names]
    generate_bar_graph(user_order_counts, user_names, 'User', 'Number of Orders', 'Number of Orders per User', 'System/application/static/summary/order_per_user_distribution.svg')

    # Distribution of Courier Managers by Location
    locations = [manager.courier_manager_city for manager in all_courier_managers]
    manager_counts = [locations.count(location) for location in set(locations)]
    generate_bar_graph(manager_counts, list(set(locations)), 'Location', 'Number of Managers', 'Courier Manager Distribution', 'System/application/static/summary/courier_manager_distribution.svg')



