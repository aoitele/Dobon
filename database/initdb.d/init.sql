create table users
(
  id serial,
  nickname text,
  status integer,
  invitation_code text,
  expired_date timestamp,
  last_login timestamp,
  created_at timestamp,
  updated_at timestamp
);

insert into users(nickname, status, invitation_code, expired_date, last_login, created_at, updated_at) values
  ('taro', 0, 'test111', now() + interval '1 week', current_date, now() - interval '2 week',  now() - interval '1 week'),
  ('jiro', 1, 'test222', now() + interval '1 week', current_date, now() - interval '2 week',  now() - interval '1 week'),
  ('saburo', 1, 'test333', now() + interval '1 week', current_date, now() - interval '2 week',  now() - interval '1 week');


create table rooms
(
  id serial,
  title text,
  status integer,
  max_seat integer,
  set_count integer,
  rate integer,
  created_at timestamp,
  updated_at timestamp
);

insert into rooms(title, status, max_seat, set_count, rate, created_at, updated_at) values
  ('ドボン王決定戦ファイナルマッチ', 0, 4, 10, 3, now() - interval '2 week',  now() - interval '1 week'),
  ('初心者の部屋', 1, 4, 20, 2, now() - interval '2 week',  now() - interval '1 week'),
  ('ドボンしようぜ', 1, 4, 10, 1, now() - interval '2 week',  now() - interval '1 week');

create table gamelogs
(
  id serial,
  room_id integer,
  user_id integer,
  action_type integer,
  card text,
  affect_user integer,
  score integer,
  endgame boolean,
  created_at timestamp,
  updated_at timestamp
);

insert into gamelogs(room_id, user_id, action_type, card, affect_user, score, endgame, created_at, updated_at) values
    (1, 1, 1, 'h1', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 2, 2, 's1', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 3, 1, 's4', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 4, 1, 's8', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 1, 1, 's2', 2, 20, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 2, 1, 'h2', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 3, 1, 'h6', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 4, 1, 'h13', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 1, 1, 's13', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 2, 1, 's1', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 3, 2, 'c1', 3, 230, false, now() - interval '2 week',  now() - interval '1 week'),
    (1, 4, 1, 'h4', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (2, 10, 1, 'h2', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (2, 20, 1, 'h6', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (2, 30, 1, 'h1', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (2, 40, 1, 'h9', null, null, false, now() - interval '2 week',  now() - interval '1 week'),
    (2, 10, 1, 'h3', 20, 120, true, now() - interval '2 week',  now() - interval '1 week');