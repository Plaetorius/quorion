"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log(data)
    toast.success("Your message has been sent successfully!")
    reset()
    setIsSubmitting(false)
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
        Have questions about Quorion? We're here to help. Reach out to our team.
      </p>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="glass-card rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="How can we help you?"
                {...register("subject")}
                className={errors.subject ? "border-destructive" : ""}
              />
              {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message here..."
                rows={5}
                {...register("message")}
                className={errors.message ? "border-destructive" : ""}
              />
              {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} variant="glow" className="w-full">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-accent/20 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">info@quorion.io</p>
                  <p className="text-muted-foreground">support@quorion.io</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/20 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-muted-foreground">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/20 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">
                    Quorion Health Data, Inc.
                    <br />
                    123 Blockchain Avenue
                    <br />
                    San Francisco, CA 94105
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Office Hours</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>

            <p className="mt-6 text-muted-foreground">
              Our support team is available 24/7 for urgent inquiries at support@quorion.io
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

