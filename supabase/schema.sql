-- Create a simple users table without authentication
CREATE TABLE users (
    id uuid default uuid_generate_v4() primary key,
    username text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert the predefined users
INSERT INTO users (username) VALUES 
    ('Manthan'),
    ('Vihan'),
    ('Nemi');

-- Table for poster uploads
CREATE TABLE posters (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users not null,
    image_url text not null,
    title text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table for ward maps
CREATE TABLE ward_maps (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users not null,
    map_url text not null,
    title text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table for skywalk audit images
CREATE TABLE skywalk_images (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users not null,
    image_url text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table for survey data
CREATE TABLE surveys (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users not null,
    data_url text,
    data jsonb,
    title text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table for interview media
CREATE TABLE interviews (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users not null,
    media_url text not null,
    media_type text not null,
    title text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table for mapillary data
CREATE TABLE mapillary (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users not null,
    mapillary_link text,
    images text[],
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table for problem solving exercises
CREATE TABLE problem_solving (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references users not null,
    solution_link text not null,
    title text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- No need for RLS since we're using a simple system
-- Enable public access to all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ward_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE skywalk_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapillary ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_solving ENABLE ROW LEVEL SECURITY;

-- Create simple policies (allow all access)
CREATE POLICY "Allow all access to users"
    ON users FOR ALL USING (true);

CREATE POLICY "Allow all access to posters"
    ON posters FOR ALL USING (true);

-- Create similar RLS policies for ward_maps
CREATE POLICY "Users can view all ward maps"
    ON ward_maps FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own ward maps"
    ON ward_maps FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ward maps"
    ON ward_maps FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ward maps"
    ON ward_maps FOR DELETE
    USING (auth.uid() = user_id);

-- Create similar RLS policies for skywalk_images
CREATE POLICY "Users can view all skywalk images"
    ON skywalk_images FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own skywalk images"
    ON skywalk_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skywalk images"
    ON skywalk_images FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skywalk images"
    ON skywalk_images FOR DELETE
    USING (auth.uid() = user_id);

-- Create similar RLS policies for surveys
CREATE POLICY "Users can view all surveys"
    ON surveys FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own surveys"
    ON surveys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys"
    ON surveys FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own surveys"
    ON surveys FOR DELETE
    USING (auth.uid() = user_id);

-- Create similar RLS policies for interviews
CREATE POLICY "Users can view all interviews"
    ON interviews FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own interviews"
    ON interviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews"
    ON interviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interviews"
    ON interviews FOR DELETE
    USING (auth.uid() = user_id);

-- Create similar RLS policies for mapillary
CREATE POLICY "Users can view all mapillary data"
    ON mapillary FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own mapillary data"
    ON mapillary FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mapillary data"
    ON mapillary FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mapillary data"
    ON mapillary FOR DELETE
    USING (auth.uid() = user_id);

-- Create similar RLS policies for problem_solving
CREATE POLICY "Users can view all problem solving exercises"
    ON problem_solving FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own problem solving exercises"
    ON problem_solving FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problem solving exercises"
    ON problem_solving FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problem solving exercises"
    ON problem_solving FOR DELETE
    USING (auth.uid() = user_id);