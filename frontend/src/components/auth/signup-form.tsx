import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import {z} from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"
const signUpSchema =z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên của bạn"),
  lastName: z.string().min(1, "Vui lòng nhập họ của bạn"),
  userName: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự").max(20, "Tên đăng nhập không được vượt quá 20 ký tự"),
  email: z.email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự")
  .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
  .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết thường")
  .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số")
  .regex(/[@$!%*?&]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"),
  repassword: z.string().min(6, "Vui lòng xác nhận mật khẩu")
}).refine((data) => data.password === data.repassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["repassword"],
})

type SignUpFormValues= z.infer<typeof signUpSchema>
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signUp} = useAuthStore();
  const navigate = useNavigate();
  const {register, handleSubmit, formState:{errors, isSubmitting}}= useForm<SignUpFormValues>({
  resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const {firstName, lastName, userName, email, password, repassword} = data;
    await signUp(userName, password, repassword, email, firstName, lastName);
    navigate("/signin");
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
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
                    <Label htmlFor="lastName" className="block text-sm">
                      Họ
                    </Label>
                    <Input id="lastName" 
                    type="text" 
                    {...register("lastName")}
                    />
                    {errors.lastName &&
                    (
                      <p className="text-destructive text-sm">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                    <div className="space-y-2">
                    <Label htmlFor="firstName" className="block text-sm">
                      Tên
                    </Label>
                    <Input id="firstName" 
                    type="text" 
                    {...register("firstName")}
                    />
                    {errors.firstName &&
                    (
                      <p className="text-destructive text-sm">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* username */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="userName" className="block text-sm">
                      Tên đăng nhập
                    </Label>
                    <Input id="userName" 
                    type="text" 
                    placeholder="Chatapp"
                    {...register("userName")}
                    />
                    {errors.userName &&
                    (
                      <p className="text-destructive text-sm">
                        {errors.userName.message}
                      </p>
                    )}
                </div>
                {/* email */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="email" className="block text-sm">
                      Email
                    </Label>
                    <Input id="email" 
                    type="email" 
                    placeholder="user@example.com"
                    {...register("email")}
                    />
                    {errors.email &&
                    (
                      <p className="text-destructive text-sm">
                        {errors.email.message}
                      </p>
                    )}
                </div>
                {/* password */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="password" className="block text-sm">
                      Mật khẩu
                    </Label>
                    <Input id="password" 
                    type="password" 
                    {...register("password")}
                    />
                    {errors.password &&
                    (
                      <p className="text-destructive text-sm">
                        {errors.password.message}
                      </p>
                    )}
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="repassword" className="block text-sm">
                      Xác nhận mật khẩu
                    </Label>
                    <Input id="repassword" 
                    type="password" 
                    {...register("repassword")}
                    />
                    {errors.repassword &&
                    (
                      <p className="text-destructive text-sm">
                        {errors.repassword.message}
                      </p>
                    )}
                </div>
                {/* nút đăng ký */}
                <Button type="submit" 
                className="w-full"
                disabled={isSubmitting}
                >
                  Đăng ký
                </Button>
                <div className="text-center text-sm">
                  Đã có tài khoản?{" "}
                  <a href="/signin" className="text-primary underline underline-offset-4">
                    Đăng nhập
                  </a>
                </div>
              </div>
          </form>
          <div className="relative hidden bg-orange-100 md:block">
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
