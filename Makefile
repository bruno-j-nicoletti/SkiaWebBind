.PHONY : release
release :
	if [ ! -d build ] ; then mkdir build; fi
	emcmake cmake -GNinja -B build .
	cd build; ninja


.PHONE: clean
clean:
	rm -rf build
