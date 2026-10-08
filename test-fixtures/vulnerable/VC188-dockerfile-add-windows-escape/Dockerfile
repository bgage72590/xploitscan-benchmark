# escape=`

# ASP.NET Core API on Windows Server containers. The escape directive above
# makes the backtick the escape character, so a Windows path can end in `\`.
FROM mcr.microsoft.com/dotnet/aspnet:8.0-windowsservercore-ltsc2022
SHELL ["cmd", "/S", "/C"]

# Visual C++ runtime installer, then the published build output
# (dotnet publish -c Release -o publish)
ADD https://aka.ms/vs/17/release/vc_redist.x64.exe C:\temp\
ADD publish C:\app\
RUN C:\temp\vc_redist.x64.exe /install /quiet /norestart && del C:\temp\vc_redist.x64.exe
WORKDIR C:\app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8080/health || exit 1
ENTRYPOINT ["dotnet", "Api.dll"]
