# BONUS Lab: Supabase

## Introduction

You already know how to build a REST API with Java, so you understand the concept: a backend that serves data to a frontend. That is great! But building a full backend from scratch every time can take a lot of time. What if you could have a production ready API running in minutes without writing a single line of backend code?

That is exactly what **Supabase** is for.

---

## What is Supabase?

Supabase is an open source Backend as a Service (BaaS). Think of it as a complete backend that someone already built for you. It gives you a **PostgreSQL database**, **auto generated REST API**, **authentication**, **real time subscriptions**, and **file storage**, all through a nice dashboard and a simple SDK.

You connect your frontend directly to Supabase and it handles the rest.

### Why Supabase instead of building your own API?

Here are some real advantages, especially for small projects like this one:

* **Zero backend code needed.** You create a table in the dashboard and Supabase instantly exposes a REST API for it. No controllers, no routes, no nothing.
* **It is PostgreSQL under the hood.** This is a real, powerful relational database. Not a toy. So you are learning with something that actually matters in production.
* **The SDK is super simple.** Fetching data from your frontend feels almost the same as calling a local function.
* **It is free to get started.** The free tier is more than enough for a lab or a small project.
* **It handles auth for you.** If you ever need login and registration, Supabase has it built in.
* **It is fast to set up.** Seriously, sometimes you can have a working API in less than 10 minutes.

As you see, for small projects that require data handling this tool is very powerful 💪😁

So for this lab the goal is clear: **you are going to create your own Supabase backend and connect it to a Next.js frontend that is already built and waiting for your data.**

---

## What you will build

You will set up a Supabase project, create a students table, seed it with data, and connect it to the provided Next.js frontend. The frontend already has all the UI components ready. It just needs you to feed it data from your Supabase backend.

By the end of this lab you will have:

* A live Supabase project with a real PostgreSQL database
* A `students` table with some data
* A Next.js app reading that data through the Supabase client
* Environment variables properly configured so everything connects securely

---

## Prerequisites

Before you start make sure you have a **Supabase account** (free at [supabase.com](https://supabase.com))

---

## Part 1: Create your Supabase Project

**Step 1.** Go to supabase.com and sign in or create a free account.

**Step 2.** Once you are in the dashboard click on **New Project**.

**Step 3.** Fill in the details:
* Give your project a name (something like `lab-supabase` works fine)
* Choose a strong database password and **save it somewhere**, you will need it later
* Select the region closest to you

**Step 4.** Click **Create new project** and wait a moment while Supabase sets everything up.

---

## Part 2: Create your Database Table with SQL

Instead of clicking through the Table Editor, you are going to create your table the real way: with SQL. This is how it is done in real projects and it is also a great excuse to practice asking an AI to write queries for you.

**Step 1.** In your Supabase dashboard click on **SQL Editor** in the left sidebar.

**Step 2.** Click **New query**.

**Step 3.** Paste the following SQL and click **Run**:

```sql
CREATE TABLE students (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  course text NOT NULL,
  picture_url text NOT NULL,
  grade text,
  created_at timestamptz DEFAULT now()
);
```

This query should create the simple table with an automatic ID. After that you can create as many rows as you want with another query. You can ask the AI to create fake data with real images like we did in class. Tell it to create the SQL query if you don't want to do it manually.

---

## Part 3: Get your Supabase credentials

Your Next.js app needs two things to connect to Supabase: the **project URL** and the **anon public key**. These are not secrets (the anon key is public by design) but you still store them as environment variables to keep your code clean and portable.

**Step 1.** In your Supabase dashboard click the **Settings** icon (gear icon ⚙️) on the left sidebar.

**Step 2.** Go to **API** under the Project Settings section.

**Step 3.** You will see your **Project URL** and your **Project API keys**. Copy the `URL` and the `anon public` key. Keep this tab open, you will need them in the next part.

---

## Part 4: Set up the Next.js App

First things first. You'll notice if you type `npm run dev` node is not detecting the script. So you need to install the dependencies first. 

```bash
npm install
```

This will add the `node_modules` folder with every package needed. 

Now it is time to connect the frontend to your Supabase backend. Before you do anything, open `app/page.jsx` and notice two things that are intentionally commented out:

```javascript
// import { supabase } from '../lib/supabaseClient'
```

and further down inside the `useEffect`:

```javascript
//fetchStudents()
```

These are commented out because the app would crash without a proper Supabase configuration. Your job in this part is to set everything up so you can uncomment them and get the app running.

**Step 1.** In the root of the project create a new file called `.env.local`.

> This file is where you store environment variables locally. It is automatically ignored by Git so your keys never get pushed to GitHub. There is a reason it is not included in this repo!

**Step 2.** Add the following variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the actual values you copied from the Supabase dashboard.

**Step 3.** Install the Supabase JavaScript client. In your terminal, inside the project folder, run:

```bash
npm install @supabase/supabase-js
```

**Step 4.** Create the Supabase client configuration file. You need to create a `lib/` directory at the root of the project and inside it a file called `supabaseClient.js`. Head over to the **Supabase documentation** and look for how to initialize the JavaScript client. It will tell you exactly what to put in that file (aah you thought I was going to tell you everything? 😂).

**Step 5.** Once you have created `lib/supabaseClient.js`, go back to `app/page.jsx` and uncomment the two lines you saw earlier: the import at the top and the `fetchStudents()` call inside the `useEffect`.

**Step 6.** Start the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`. If everything is connected you wont see any errors. But, do you see the students?

---

## Part 5: How the Data Fetching Works

Open `app/page.jsx` and take a look at the `useEffect` inside the component. This is where the data fetching happens:

```javascript
const { data, error } = await supabase
  .from('students')
  .select('*')
  .order('created_at', { ascending: false })
```

This queries the `students` table and returns all rows ordered by creation date. The result goes into the `students` state and React re renders the table automatically.

---

## Part 6: Row Level Security (Important!)

By default Supabase has Row Level Security (RLS) enabled on new tables. This means your API calls might return an empty array even if you have data in the table. This is a security feature and it is actually really cool. But for this lab we need to allow public reads.

**Step 1.** In your Supabase dashboard go to **Authentication** and then **Policies**.

**Step 2.** Find the `students` table and click **New Policy**.

**Step 3.** Choose **Enable read access for all users** (or create a policy manually that allows `SELECT` for the `anon` role).

**Step 4.** Save the policy and reload your app. Now you should see your students showing up.

---

## Iteration

Once your basic setup is working try to push it a bit further:

* Can you add a search input that filters the students list by name on the frontend?
* Can you add a filter so only students from a specific course are shown? Check out `.eq('course', 'Web Development')` in the Supabase docs.
* Can you sort the results alphabetically by name instead of by date?
* Can you add a new student from the frontend using `supabase.from('students').insert({...})`?

---

## Useful Resources

* Supabase official docs: https://supabase.com/docs
* Supabase JavaScript client reference: https://supabase.com/docs/reference/javascript
* Next.js docs: https://nextjs.org/docs

