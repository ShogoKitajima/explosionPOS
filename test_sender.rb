require "json"
require "date"

require 'webrick'

srv = WEBrick::HTTPServer.new({:BindAddress => '127.0.0.1',
                               :Port => 10080})
srv.mount_proc("/") { |req, res|

  info = Hash.new([])

  # set datetime
  now = DateTime.now()
  datetime = {
    "year" => now.year,
    "month" => now.month,
    "day" => now.day,
    "hour" => now.hour,
    "min" => now.min,
    "sec" => now.sec,
  }
  info[:datetime] = datetime
  student_info = {
    "number" => "12345678", 
    "name" => "tomorinao"
  }
  begin
    info[:student_info] = student_info
  rescue
    info[:student_info] = nil
  end
  
  puts info.to_json

	cb_funcname = req.query["callback"]
	res["Content-Type"] = "application/javascript"
	if cb_funcname =~ /^[\$_a-zA-Z][\w\$]*$/
		res.body = cb_funcname + "(" +info.to_json + ")"
	else
		res.body = "callback(" +info.to_json + ")"
	end
}
Signal.trap(:INT){ srv.shutdown }
srv.start
