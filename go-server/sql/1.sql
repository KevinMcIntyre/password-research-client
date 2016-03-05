--! This is the SQL script for initializing the TU Password Research database !--

-- CREATE DATABASE tupwresearch OWNER postgres;

--! TABLES !--

CREATE TABLE subjects (
  id            BIGSERIAL     NOT NULL,
  username      VARCHAR(30)   NOT NULL,
  email         VARCHAR(30)   UNIQUE,
  password      VARCHAR(60),
  pin_number    VARCHAR(10),
  first_name    VARCHAR(50),
  last_name     VARCHAR(50),
  birth_date    DATE,
  creation_date TIMESTAMP,
  notes         TEXT,
  CONSTRAINT pk_subjects PRIMARY KEY (id)
);

CREATE TABLE saved_images (
  id              BIGSERIAL     NOT NULL,
  image           BYTEA         NOT NULL,
  image_type      VARCHAR(20)   NOT NULL,
  subject_id      INTEGER,
  alias           VARCHAR(40),
  creation_date   TIMESTAMP,
  CONSTRAINT pk_saved_images PRIMARY KEY (id)
);

CREATE TABLE uploaded_images (
  id              BIGSERIAL     NOT NULL,
  image           BYTEA         NOT NULL,
  image_type      VARCHAR(20)   NOT NULL,
  subject_id      INTEGER,
  alias           VARCHAR(40),
  creation_date   TIMESTAMP,
  CONSTRAINT pk_uploaded_images PRIMARY KEY (id)
);

CREATE TABLE image_trials (
  id                BIGSERIAL     NOT NULL,
  subject_id        INTEGER       NOT NULL,
  passed_auth       BOOLEAN,
  rows_in_matrix    INTEGER,
  cols_in_matrix    INTEGER,
  start_time        TIMESTAMP,
  end_time          TIMESTAMP,
  notes             TEXT,
  CONSTRAINT pk_image_trials PRIMARY KEY (id)
);

CREATE TABLE image_stages (
  id                          BIGSERIAL     NOT NULL,
  trial_id                    INTEGER       NOT NULL,
  answered_correctly          BOOLEAN,
  duration_in_ms              BIGINT,
  mouse_movement_in_pixels    BIGINT,
  mouse_speed_pixels_per_sec  INTEGER,
  start_time                  TIMESTAMP,
  end_time                    TIMESTAMP,
  notes                       TEXT,
  CONSTRAINT pk_image_stage_trials PRIMARY KEY (id)
);

-- CREATE TABLE pin_trials (
--   id                INTEGER       NOT NULL,
--   user_id           INTEGER       NOT NULL,
--   creation_date     TIMESTAMP,
--   notes             TEXT,
--   CONSTRAINT pk_pin_trials PRIMARY KEY (id)
-- );
--
-- CREATE TABLE string_trials (
--   id                INTEGER       NOT NULL,
--   user_id           INTEGER       NOT NULL,
--   creation_date     TIMESTAMP,
--   notes             TEXT,
--   CONSTRAINT pk_string_trials PRIMARY KEY (id)
-- );

--! JOIN TABLES !--

CREATE TABLE image_placement_info (
  image_stage_id    INTEGER     NOT NULL, --! Foreign Key
  image_id          INTEGER     NOT NULL, --! Foreign Key
  row               INTEGER     NOT NULL,
  col               INTEGER     NOT NULL,
  CONSTRAINT pk_image_placement_info PRIMARY KEY (image_stage_id, image_id)
);

--! SEQUENCES !--

CREATE SEQUENCE subjects_seq;
CREATE SEQUENCE saved_images_seq;
CREATE SEQUENCE uploaded_images_seq;
CREATE SEQUENCE image_trials_seq;
CREATE SEQUENCE image_stage_trials_seq;
-- CREATE SEQUENCE pin_trials_seq;
-- CREATE SEQUENCE string_trials_seq;

--! FOREIGN KEY REFERENCES !--
ALTER TABLE saved_images ADD CONSTRAINT fk_saved_images_subject_id_01 FOREIGN KEY (subject_id) REFERENCES subjects (id);
ALTER TABLE uploaded_images ADD CONSTRAINT fk_uploaded_images_subject_id_01 FOREIGN KEY (subject_id) REFERENCES subjects (id);
ALTER TABLE image_trials ADD CONSTRAINT fk_image_trials_subject_id_01 FOREIGN KEY (subject_id) REFERENCES subjects (id);
ALTER TABLE image_stages ADD CONSTRAINT fk_image_stages_trial_id_01 FOREIGN KEY (trial_id) REFERENCES image_trials (id);
ALTER TABLE image_placement_info ADD CONSTRAINT fk_image_placement_stage_id_01 FOREIGN KEY (image_stage_id) REFERENCES image_stages (id);
ALTER TABLE image_placement_info ADD CONSTRAINT fk_image_placement_image_id_01 FOREIGN KEY (image_id) REFERENCES saved_images (id);

--! CREATE INDICES !--
CREATE UNIQUE INDEX subject_id ON subjects (id);
CREATE UNIQUE INDEX saved_image_id ON saved_images (id);
CREATE UNIQUE INDEX uploaded_image_id ON uploaded_images (id);
CREATE UNIQUE INDEX image_trial_id ON image_trials (id);
CREATE UNIQUE INDEX image_stage_id ON image_stages (id);
CREATE INDEX image_subject_id ON saved_images (subject_id);
