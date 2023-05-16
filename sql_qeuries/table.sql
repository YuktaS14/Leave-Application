BEGIN;


CREATE TABLE IF NOT EXISTS public.faculty_list
(
    name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT faculty_list_pkey PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS public.holiday_list
(
    holiday character varying COLLATE pg_catalog."default",
    date timestamp without time zone,
    day character varying COLLATE pg_catalog."default",
    type character varying COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS public.leave_applications
(
    roll_no integer,
    name character varying COLLATE pg_catalog."default",
    depeartment character varying COLLATE pg_catalog."default",
    program character varying COLLATE pg_catalog."default",
    leave_balance integer,
    leave_perpose character varying COLLATE pg_catalog."default",
    days_applied integer,
    overflow_leave integer,
    type_of_leave integer,
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    nature_of_duty character varying COLLATE pg_catalog."default",
    alternate_student_roll_no character varying COLLATE pg_catalog."default",
    alternate_student_name character varying COLLATE pg_catalog."default",
    fa_status status DEFAULT 'pending'::status,
    pm_status status DEFAULT 'pending'::status,
    admin_status status DEFAULT 'pending'::status
);

CREATE TABLE IF NOT EXISTS public.student_faculty
(
    roll_no integer,
    email_fa character varying COLLATE pg_catalog."default",
    email_pm character varying COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS public.student_info
(
    roll_no integer NOT NULL,
    name character varying COLLATE pg_catalog."default",
    leave_balance integer,
    extra_leave integer DEFAULT 0,
    CONSTRAINT student_info_pkey PRIMARY KEY (roll_no)
);

CREATE TABLE IF NOT EXISTS public.ta_instructor
(
    roll_no integer,
    instructor_email character varying COLLATE pg_catalog."default",
    course character varying COLLATE pg_catalog."default"
);

ALTER TABLE IF EXISTS public.leave_applications
    ADD CONSTRAINT fk_roll_no_ FOREIGN KEY (roll_no)
    REFERENCES public.student_info (roll_no) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.student_faculty
    ADD CONSTRAINT fk_email_fa FOREIGN KEY (email_fa)
    REFERENCES public.faculty_list (email) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.student_faculty
    ADD CONSTRAINT fk_email_pm FOREIGN KEY (email_pm)
    REFERENCES public.faculty_list (email) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.student_faculty
    ADD CONSTRAINT fk_roll_no FOREIGN KEY (roll_no)
    REFERENCES public.student_info (roll_no) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.ta_instructor
    ADD CONSTRAINT fk_roll_no FOREIGN KEY (roll_no)
    REFERENCES public.student_info (roll_no) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

END;