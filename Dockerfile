# Use the official NGINX image as a base image
FROM nginx:alpine

# Remove the default NGINX configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy the static files from your project into the container
# Adjust the source path if your build output is in a folder (e.g. "dist" or "build")
COPY . /usr/share/nginx/html

# Expose port 80 to the host
EXPOSE 80

# Start NGINX when the container launches
CMD ["nginx", "-g", "daemon off;"]
