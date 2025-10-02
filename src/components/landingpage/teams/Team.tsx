// components/landingpage/teams/Team.tsx
"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Member = { name: string; role: string; initials: string }

export function Team() {
  const members: Member[] = [
    { name: "Naimal Salahuddin", role: "Team Lead | Full Stack Developer", initials: "NS" },
    { name: "Nirma Qureshi", role: "Product Architect | Full Stack Developer", initials: "NQ" },
    { name: "Syed Shurem Ali", role: "Frontend Developer", initials: "SA" },
    { name: "Taha Saif", role: "Full Stack Developer", initials: "TS" },
  ]

  return (
    <section className="py-20 bg-white text-black fade-section">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
        <p className="text-lg text-gray-600 mb-12">The passionate individuals behind Room Matcher AI</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((m, i) => (
            <Card key={i} className="text-center bg-white border border-gray-200 rounded-xl shadow-sm card-anim hover:border-blue-200 transform transition duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader>
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="text-xl font-bold bg-blue-600 text-white">{m.initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-semibold">{m.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600">{m.role}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
