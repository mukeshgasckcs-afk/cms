from . import mail 
from flask_mail import Mail, Message
def send_confirmation_email():
    msg = Message('Courier Generation', sender='mad2023may@gmail.com', recipients=['shibkumarsaraf05@gmail.com'])
    msg.body = 'Your Courier has been generated.'
    print("sending confirmation email")
    mail.send(msg)
    print('sent')


def send_notification_email():
    msg = Message('CSV Generation Notification', sender='mad2023may@gmail.com', recipients=['shibkumarsaraf05@gmail.com'])
    msg.body = 'Your CSV file has been generated.'
    print("sending notification_email")
    mail.send(msg)
    print('sent')

def send_transit_email():
    msg = Message('Transit Notification', sender='mad2023may@gmail.com', recipients=['shibkumarsaraf05@gmail.com'])
    msg.body = 'Your Courier has been transit.'
    print("sending transit email")
    mail.send(msg)
    print('sent')

def send_cancel_email():
    msg = Message('Cancel Notification', sender='mad2023may@gmail.com', recipients=['shibkumarsaraf05@gmail.com'])
    msg.body = 'Your Courier has been cancelled.'
    print("sending cancel email")
    mail.send(msg)
    print('sent')

def send_deliver_email():
    msg = Message('delivery Notification', sender='mad2023may@gmail.com', recipients=['shibkumarsaraf05@gmail.com'])
    msg.body = 'Your Courier has been delivered.'
    print("sending deliver email")
    mail.send(msg)
    print('sent')
