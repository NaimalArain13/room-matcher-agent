"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Target,
  Sparkles,
  Heart,
  TrendingUp,
  Award,
  Mail,
  Phone,
  MapPin,
  CheckCircle
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          opacity: 0,
          y: 50,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        })
      }

     if (statsRef.current) {
  const stats = statsRef.current.querySelectorAll('.stat-card')
  stats.forEach((stat) => {
    const value = stat.querySelector('.stat-value') as HTMLElement
    if (value) {
      const target = parseFloat(value.getAttribute('data-value') || '0')
      const suffix = value.textContent?.replace(/[0-9]/g, '') || '+' // keep "%" or "/5"

      const obj = { val: 0 } // dummy object
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
        },
        onUpdate: () => {
          if (target >= 1000 && !suffix.includes("%") && !suffix.includes("/")) {
            value.textContent = (obj.val / 1000).toFixed(1) + "K+"
          } else {
            value.textContent = Math.floor(obj.val) + suffix
          }
        },
      })
    }
  })
}


      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.timeline-item')
        items.forEach((item, index) => {
          gsap.from(item, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.8,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            }
          })
        })
      }

      if (missionRef.current) {
        gsap.from(missionRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
          }
        })
      }

      if (contactRef.current) {
        gsap.from(contactRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
          }
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you soon.")
  }

  return (
    <div className="flex flex-col min-h-screen">
 

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-background dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-background">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-800"></div>

          <div ref={heroRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                <Heart className="w-3 h-3 mr-1" />
                Our Story
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Making Student Living
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Better Together
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Room Matcher AI was born from a simple observation: finding the right roommate shouldn&apos;t be a game of chance.
                We&apos;re using artificial intelligence to transform how students find compatible living arrangements.
              </p>
            </div>
          </div>
        </section>

        <section ref={statsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: 10000, label: "Happy Students", color: "from-blue-600 to-cyan-600" },
              { icon: CheckCircle, value: 5000, label: "Successful Matches", color: "from-cyan-600 to-blue-600" },
              { icon: TrendingUp, value: 95, label: "Match Success Rate", suffix: "%", color: "from-blue-500 to-cyan-500" },
              { icon: Award, value: 4.8, label: "Average Rating", suffix: "/5", color: "from-cyan-500 to-blue-500" }
            ].map((stat, index) => (
              <Card key={index} className="stat-card border-2 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="stat-value text-3xl font-bold mb-1" data-value={stat.value}>
                    0{stat.suffix || '+'}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Road to 10K+ Users</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a hackathon idea to serving thousands of students across Pakistan
            </p>
          </div>

          <div ref={timelineRef} className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 via-cyan-600 to-blue-600 hidden md:block"></div>

            <div className="space-y-12">
              {[
                {
                  year: "2024 - Q1",
                  title: "The Beginning",
                  description: "Started as a hackathon project with a vision to solve student housing problems using AI technology.",
                  users: "Beta Launch"
                },
                {
                  year: "2024 - Q2",
                  title: "First 1,000 Users",
                  description: "Reached our first milestone with 1,000 students successfully matched. Refined our AI algorithms based on real feedback.",
                  users: "1K Users"
                },
                {
                  year: "2024 - Q3",
                  title: "Rapid Growth",
                  description: "Expanded to multiple cities across Pakistan. Introduced advanced compatibility scoring and personality matching.",
                  users: "5K Users"
                },
                {
                  year: "2024 - Q4",
                  title: "10K Milestone",
                  description: "Celebrated 10,000 happy students finding their perfect roommates. Achieved 95% satisfaction rate.",
                  users: "10K+ Users"
                }
              ].map((milestone, index) => (
                        <div
                        key={index}
                        className={`timeline-item flex flex-col md:flex-row items-center md:items-stretch gap-8 ${
                            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}
                        >
                        <div className="w-full md:flex-1 md:text-left">
                            <Card className="border-2 hover:shadow-lg transition-shadow w-full">
                            <CardContent className="p-6">
                                <Badge className="mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                                {milestone.year}
                                </Badge>
                                <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                                <p className="text-muted-foreground mb-3">{milestone.description}</p>
                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                                <Users className="w-4 h-4" />
                                {milestone.users}
                                </div>
                            </CardContent>
                            </Card>
                        </div>

                        {/* Circle only visible on md+ */}
                        <div className="hidden md:block relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg border-4 border-background">
                            <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="hidden md:flex flex-1"></div>
                        </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={missionRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To revolutionize student living by using AI to create perfect roommate matches, reducing conflicts and enhancing the college experience."
              },
              {
                icon: Sparkles,
                title: "Our Vision",
                description: "A world where every student finds a compatible roommate, making housing decisions stress-free and enjoyable for everyone."
              },
              {
                icon: Heart,
                title: "Our Values",
                description: "Trust, transparency, and technology working together to build better communities. We believe great roommates create lifelong friendships."
              }
            ].map((item, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-background dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-background">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,black,transparent)] dark:bg-grid-slate-800"></div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 mb-4">
                Get In Touch
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="space-y-6">
                <Card className="border-2">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground text-sm">support@roommatcherai.com</p>
                      <p className="text-muted-foreground text-sm">info@roommatcherai.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground text-sm">+92 316 3836744</p>
                      <p className="text-muted-foreground text-sm">Available 24 Hours</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground text-sm">Hyderabad, Pakistan</p>
                      <p className="text-muted-foreground text-sm">Serving students nationwide</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 shadow-lg">
                <CardContent className="p-6">
                  <form ref={contactRef} onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                      <Input id="subject" placeholder="How can we help?" required />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                      <Textarea id="message" placeholder="Your message..." rows={5} required />
                    </div>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold tracking-wide 
                              bg-gradient-to-r from-blue-600 to-cyan-600 
                              hover:from-blue-700 hover:to-cyan-700 
                              text-white shadow-lg shadow-blue-600/30 
                              transform transition-all duration-300 
                              hover:scale-105 active:scale-95"
                  >
                    🚀 Send Message
                  </Button>

                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

     
    </div>
  )

}