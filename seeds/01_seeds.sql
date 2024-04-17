--   INSERT INTO reservations ( column1, column2, column3, column4, column5, )     -- specify the table and which columns
--     VALUES (1, 45, 55, '2024-01-04', '2024-01-07');                             -- specify the corresponding values in order

------------ seed data for users ----------------

INSERT INTO users ( id, name, email, password)
  VALUES (1, 'George Washington', 'pres#1@usa.gov', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users ( id, name, email, password)
  VALUES (2, 'Mozart', 'mozart@muzikisgreat.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users ( id, name, email, password)
  VALUES (3, 'Ada Lovelace', 'ada_lovelace@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users ( id, name, email, password)
  VALUES (4, 'Leonardo da Vinci', 'leo_da_vinci@rennaisance.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users ( id, name, email, password)
  VALUES (5, 'Frederic Chopin', 'composer@interia.pl', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

------------ seed data for properties ----------------

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, country, post_code, active)
VALUES
  (1, 1, 'Cozy Cabin Retreat', 'Charming cabin in the woods', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 500, 3, 2, 3, 'Forest Avenue', 'Vancouver', 'British Columbia', 'Canada', 'V5K 2J8', true);
INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, country, post_code, active)
VALUES
  (2, 4, 'Luxurious Beachfront Villa', 'Stunning villa with ocean views', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 700, 2, 3, 4, 'Ocean Drive', 'Toronto', 'Ontario', 'Canada', 'M5V 2E8', true);

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, country, post_code, active)
VALUES
  (3, 4, 'Mountain View Chalet', 'Cozy chalet with panoramic mountain views', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 400, 1, 1, 2, 'Alpine Street', 'Calgary', 'Alberta', 'Canada', 'T2E 6L6', true);

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, country, post_code, active)
VALUES
  (4, 3, 'Riverside Cottage', 'Quaint cottage by the river', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 800, 1, 2, 3, 'Riverbank Lane', 'Montreal', 'Quebec', 'Canada', 'H3B 2Y8', true);

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, country, post_code, active)
VALUES
  (5, 2, 'City View Penthouse', 'Elegant penthouse with city skyline views', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 300, 1, 1, 1, 'Skyline Boulevard', 'Edmonton', 'Alberta', 'Canada', 'T5J 2N5', true);

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, city, province, country, post_code, active)
VALUES
  (6, 5, 'Lakefront Retreat', 'Serene retreat by the lake', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 'https://images.pexels.com/photos/2099019/pexels-photo-2099019.jpeg', 600, 2, 2, 3, 'Lakeside Drive', 'Ottawa', 'Ontario', 'Canada', 'K1A 0A1', true);


------------ seed data for reservations ----------------

INSERT INTO reservations ( id, guest_id, property_id, start_date, end_date)   
  VALUES (1, 5, 4, '2022-05-04', '2022-05-015');
INSERT INTO reservations ( id, guest_id, property_id, start_date, end_date)   
  VALUES (2, 4, 1, '2020-01-22', '2020-01-27');
INSERT INTO reservations ( id, guest_id, property_id, start_date, end_date)   
  VALUES (3, 3, 2, '2022-02-01', '2024-02-03');
INSERT INTO reservations ( id, guest_id, property_id, start_date, end_date)   
  VALUES (4, 3, 4, '2019-07-16', '2019-07-17');
INSERT INTO reservations ( id, guest_id, property_id, start_date, end_date)   
  VALUES (5, 2, 5, '2024-01-04', '2024-01-07');

------------ seed data for reviews ----------------

INSERT INTO property_reviews ( id, guest_id, property_id, reservation_id, rating, message)   
  VALUES (1, 5, 4, 1, 4, 'This property exceeded my expectations! The amenities were top-notch.');

INSERT INTO property_reviews ( id, guest_id, property_id, reservation_id, rating, message)   
  VALUES (2, 4, 1, 2, 1, 'Unfortunately, my experience with this property was disappointing.');

INSERT INTO property_reviews ( id, guest_id, property_id, reservation_id, rating, message)   
  VALUES (3, 3, 2, 3, 2, 'Not the best experience. The property needs some maintenance.');

INSERT INTO property_reviews ( id, guest_id, property_id, reservation_id, rating, message)   
  VALUES (4, 3, 4, 4, 5, 'Exceeded all expectations! A luxurious and comfortable stay.');

INSERT INTO property_reviews ( id, guest_id, property_id, reservation_id, rating, message)   
  VALUES (5, 2, 5, 5, 3, 'The property was nice, but the service could be improved.');




/* -- experiment with gpt assisted insert queries

Given the following data populate the brackets within values

 INSERT INTO property_reviews ( id, guest_id, property_id, reservation_id, rating, message)   
  VALUES ();

    Ensure that the ID begins at 1 and increments. 
    The guest_id, property_id, and reservation_id should be random numbers between 1 and 50. 
    The rating should be an integer between 1 and 5.
    For the message, generate a corresponding message of around 100 characters based on the rating, ranging from 1 to 5.

------------------------------------------------------------------
returned the following code

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES  (1, 12, 28, 42, 4, 'This property exceeded my expectations! The amenities were top-notch.'),
  (2, 29, 7, 18, 2, 'The property was decent, but there were a few issues that could be improved.'),
  (3, 8, 43, 31, 5, 'Absolutely stunning property! The views were breathtaking.'),
  (4, 35, 16, 5, 1, 'Unfortunately, my experience with this property was disappointing.'),
  (5, 17, 49, 20, 3, 'A pleasant stay overall. The property was clean and comfortable.'),
  (6, 46, 22, 47, 4, 'Great location and ambiance! Would definitely recommend.'),
  (7, 9, 13, 38, 2, 'Not the best experience. The property needs some maintenance.'),
  (8, 21, 36, 10, 5, 'Exceeded all expectations! A luxurious and comfortable stay.'),
  (9, 42, 5, 26, 1, 'Disappointed with the cleanliness and amenities.'),
  (10, 14, 30, 48, 3, 'The property was nice, but the service could be improved.'); */