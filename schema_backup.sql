--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2024-12-19 12:17:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16457)
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid,
    profile_id uuid,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_edited boolean DEFAULT false
);


--
-- TOC entry 226 (class 1259 OID 16477)
-- Name: followers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.followers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    follower_id uuid,
    following_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 217
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- TOC entry 220 (class 1259 OID 16396)
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


--
-- TOC entry 219 (class 1259 OID 16395)
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 219
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- TOC entry 224 (class 1259 OID 16443)
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid,
    type character varying(255) NOT NULL,
    url character varying(255) NOT NULL,
    filename character varying(255),
    size_bytes integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    mimetype character varying(255)
);


--
-- TOC entry 223 (class 1259 OID 16428)
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    title character varying(255) NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    streak_day integer,
    chapter character varying(255),
    location point,
    is_published boolean DEFAULT true,
    project_id uuid NOT NULL,
    post_index integer
);


--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    bio text,
    profile_picture_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp with time zone,
    is_google_user boolean DEFAULT false,
    google_id character varying(255)
);


--
-- TOC entry 227 (class 1259 OID 16528)
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 222 (class 1259 OID 16414)
-- Name: social_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    platform character varying(255) NOT NULL,
    url character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 4674 (class 2604 OID 16392)
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 16399)
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- TOC entry 4709 (class 2606 OID 16466)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4711 (class 2606 OID 16495)
-- Name: followers followers_follower_id_following_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_id_following_id_unique UNIQUE (follower_id, following_id);


--
-- TOC entry 4713 (class 2606 OID 16483)
-- Name: followers followers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_pkey PRIMARY KEY (id);


--
-- TOC entry 4697 (class 2606 OID 16401)
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- TOC entry 4695 (class 2606 OID 16394)
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 16451)
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 16437)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 4699 (class 2606 OID 16413)
-- Name: profiles profiles_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_email_unique UNIQUE (email);


--
-- TOC entry 4701 (class 2606 OID 16411)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4715 (class 2606 OID 16537)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4703 (class 2606 OID 16422)
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- TOC entry 4720 (class 2606 OID 16467)
-- Name: comments comments_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_foreign FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 4721 (class 2606 OID 16472)
-- Name: comments comments_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4722 (class 2606 OID 16484)
-- Name: followers followers_follower_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_id_foreign FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4723 (class 2606 OID 16489)
-- Name: followers followers_following_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_following_id_foreign FOREIGN KEY (following_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4719 (class 2606 OID 16452)
-- Name: media media_post_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_post_id_foreign FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 4717 (class 2606 OID 16438)
-- Name: posts posts_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4718 (class 2606 OID 16558)
-- Name: posts posts_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4724 (class 2606 OID 16538)
-- Name: projects projects_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- TOC entry 4716 (class 2606 OID 16423)
-- Name: social_links social_links_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


-- Completed on 2024-12-19 12:17:09

--
-- PostgreSQL database dump complete
--

