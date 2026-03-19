import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
                {/* header -logo */}
                <div className="flex flex-col items-center text-center gap-2">
                  <a href="/"
                    className="mx-auto block w-fit text-center ">
                    <img src="/logo.svg" alt="Logo" className="h-20 w-auto"/>
                  </a>
                    <h1 className="text-2xl font-bold">Đăng ký</h1>
                    <p className="text-muted-foreground text-balance">
                      Tạo tài khoản để bắt đầu
                    </p>
                </div>
                {/* họ và tên */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="block text-sm">
                      Họ
                    </Label>
                    <Input id="lastname" type="text" />
                    {/* todo: error message */}
                  </div>
                    <div className="space-y-2">
                    <Label htmlFor="firstname" className="block text-sm">
                      Tên
                    </Label>
                    <Input id="firstname" type="text" />
                    {/* todo: error message */}
                  </div>
                </div>
                {/* username */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="username" className="block text-sm">
                      Tên đăng nhập
                    </Label>
                    <Input id="username" type="text" placeholder="Chatapp"/>
                    {/* todo: error message */}
                </div>
                {/* email */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="email" className="block text-sm">
                      Email
                    </Label>
                    <Input id="email" type="email" placeholder="user@example.com"/>
                    {/* todo: error message */}
                </div>
                {/* password */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="password" className="block text-sm">
                      Mật khẩu
                    </Label>
                    <Input id="password" type="password" />
                    {/* todo: error message */}
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="repassword" className="block text-sm">
                      Xác nhận mật khẩu
                    </Label>
                    <Input id="password" type="password" />
                    {/* todo: error message */}
                </div>
                {/* nút đăng ký */}
                <Button type="submit" className="w-full">
                  Đăng ký
                </Button>
              </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  )
}
