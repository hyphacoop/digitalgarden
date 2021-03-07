# frozen_string_literal: true

require 'html-proofer'

task default: :check

desc 'Clean out _site'
task :clean do
  sh 'rm -rf _site'
end

desc 'Preview site'
task watch: :clean do
  sh 'jekyll serve --watch'
end

desc 'Build site'
task build: :clean do
  sh 'jekyll build'
end

desc 'Run HTMLProofer on _site'
task check: :build do
  options = {
    check_html: true,
    allow_hash_href: true,
    assume_extension: true,
    typhoeus: {
      headers: { "User-Agent": 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:86.0) Gecko/20100101 Firefox/86.0' }
    }
  }
  HTMLProofer.check_directory('./_site', options).run
end
