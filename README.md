# Memopad Notes v.1.0

## Description

This is a web app for creating and managing multiple lists. It was created for my personal household use.
It was originally designed to be used on mobile devices, but now supports all screen sizes.

The list data is saved to a PostgreSQL database.

## How-to-use

New items can be added from the sidebar or the main view, depending on the device and screen size. Items can then be added, edited or removed. Items can also be greyed-out by double clicking a list item.

Upon the creation of a new list, the input for adding list items is opened by default. For unobstructed list viewing, the visibility of the input can be toggled with the chevron on the current list's top bar.

## Run in local environment

You can run the repo locally, but cannot connect to the database due to secret backend env variables.

To run the frontend navigate to the frontend folder, install dependencies, and run.

```
cd frontend

npm install

npm run dev
```


To run the backend navigate to the backend folder, install dependencies, and run.

```
cd backend

npm install

npm run dev
```

## Planned Features

- List and item sorting (_work in progress_)
- User profiles and personal lists
- List sharing
