"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Member = { name: string; role: string; initials: string; color: string }

export function Team() {
  const members: Member[] = [
    { name: "Naimal Salahuddin", role: "Team Lead | Full Stack Developer", initials: "NS", color: "from-blue-500 to-indigo-600" },
    { name: "Nirma Qureshi", role: "Product Architect | Full Stack Developer", initials: "NQ", color: "from-purple-500 to-pink-600" },
    { name: "Syed Shurem Ali", role: "Frontend Developer | Documentation Creator", initials: "SA", color: "from-emerald-500 to-teal-600" },
    { name: "Taha Saif", role: "Full Stack Developer", initials: "TS", color: "from-orange-500 to-red-600" },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-black">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind Room Matcher AI
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((m, i) => (
            <Card 
              key={i} 
              className="group relative text-center bg-white border-2 border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <CardHeader className="pt-8 pb-4">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <AvatarFallback className={`text-2xl font-bold bg-gradient-to-br ${m.color} text-white`}>
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Glow circle under avatar */}
                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${m.color} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-500">
                  {m.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pb-8">
                <CardDescription className="text-sm text-gray-600 leading-relaxed px-2">
                  {m.role}
                </CardDescription>
              </CardContent>
              
              {/* Bottom border animation */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${m.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
