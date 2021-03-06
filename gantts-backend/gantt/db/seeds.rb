# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Project.destroy_all
Track.destroy_all
Task.destroy_all

do_makeup = Project.create(name: "Kat's morning")
track = Track.create(priority: 1, project: do_makeup)
apply_eyeshadow = Task.create(title: "do eyes", content: "don't look like a whore", start_time: 0, duration: 100, track: track)
apply_foundation = Task.create(title: "foundation", content: "something something blemishes", start_time: 100, duration: 100, track: track)

track2 = Track.create(priority: 2, project: do_makeup)
make_coffee = Task.create(title: "make coffee", content: "gotta get that zip", start_time: 0, duration: 100, track: track2)
